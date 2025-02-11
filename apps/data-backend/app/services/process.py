import json
import os
import pandas as pd
import numpy as np
from sklearn.cluster import HDBSCAN
from sklearn.neighbors import KNeighborsClassifier
import umap
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from dotenv import load_dotenv
from .fuse_prompt import FusePromptFacade, PromptName
from .mongodb import MongoDBService
from ..utils.logger import logger
from datetime import datetime, timedelta
from typing import Dict, Any
from sklearn.neighbors import KNeighborsClassifier
import asyncio

load_dotenv()

class ProcessService:
    def __init__(self):
        self.fuse_prompt_facade = FusePromptFacade()
        self.mongodb = MongoDBService()

    def get_embedder(self, fuseprompt):
        logger.info(
            "Initializing Embedder",
            extra={
                'model': fuseprompt.config['model']
            }
        )

        embedder = AzureOpenAIEmbeddings(
            model='text-embedding-3-large',
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            openai_api_version='2023-05-15',
        )
        return embedder

    def get_llm(self, fuseprompt):
        logger.info(
            "Initializing LLM",
            extra={
                'model': fuseprompt.config['model']
            }
        )
        llm = AzureChatOpenAI(
            azure_deployment=fuseprompt.config['model'],
            api_version=os.getenv("OPENAI_API_VERSION"),
            temperature=fuseprompt.config['temperature']
        )
        if 'json_schema' in fuseprompt.config:
            llm = llm.with_structured_output(schema=fuseprompt.config['json_schema'])
        return llm

    async def ingest_article(self, article_data: Dict[str, Any]):
        logger.info(
            "Starting article ingestion",
            extra={
                'article_title': article_data.get('title', 'Unknown Title')
            }
        )
        
        # Process with LLM
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.ARTICLE_INGEST_CHAT)
        llm = self.get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, article=article_data)[0]["content"]
        article_profile = await llm.ainvoke(instructions)

        # Process Embeddings
        fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.ARTICLE_EMBEDDINGS)
        embedder = self.get_embedder(fuseprompt_embeddings)
        embeddings_instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt_embeddings, **article_profile)
        embeddings = await embedder.aembed_query(embeddings_instructions)

        logger.info(
            "Article ingestion completed",
            extra={
                'article_title': article_data.get('title', 'Unknown Title')
            }
        )

        article_profile["embeddings"] = embeddings
        return article_profile

    async def ingest_reader(self, reader_data: Dict[str, Any]):
        logger.info(
            "Starting reader ingestion"
        )

        # Process with LLM
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.READER_PROFILER)
        llm = self.get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, reader=reader_data)
        reader_profile = await llm.ainvoke(instructions)

        # Process Embeddings
        fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.READER_EMBEDDINGS)
        embedder = self.get_embedder(fuseprompt_embeddings)
        embeddings_instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt_embeddings, **reader_profile)
        embeddings = await embedder.aembed_query(embeddings_instructions)

        reader_profile["embeddings"] = embeddings

        logger.info(
            "Reader ingestion completed"
        )
        return reader_profile

    async def get_daily(self, reader_id: str):
        now_time = datetime.utcnow()
        last_24_hours = now_time - timedelta(hours=24)
        reader = await self.mongodb.get_reader(reader_id)
        query_filter = {
            "createdAt": {
                "$gte": last_24_hours,
                "$lte": now_time
            }
        }
        vector_search = {
            '$vectorSearch': {
                'index': 'article_embeddings',
                'path': 'embeddings',
                'queryVector': reader['embeddings'],
                'filter': query_filter,
                'numCandidates': 400,
                'limit': 30 
            }
        }

        pipeline = [
            vector_search,
            {
                '$project': {
                    '_id': 0,
                    'url': 1,
                    "title": "$enrichment.title",
                    "summary": "$enrichment.summary",
                    "image": 1
                }
            }
        ]
        articles = await self.mongodb.aggregate_articles(pipeline)
        reader["relevant_articles"] = articles
        if len(articles) == 0:
            logger.info("No articles found")
            return {"sections": []}
            
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.DAILY_DIGEST)
        llm = self.get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, **reader)
        daily_digest = await llm.ainvoke(instructions)
        return daily_digest

    def fix_outliers(self, df,):
        def fix_outliers_(df):
            outliers = df[df['cluster'] == -1]
            if not outliers.empty:
                knn = KNeighborsClassifier(n_neighbors=3)
                
                known_points = df[df['cluster'] != -1]
                known_points = self.get_np_embeddings(known_points)
                known_labels = df[df['cluster'] != -1]['cluster']
                
                knn.fit(known_points, known_labels)
                df.loc[df['cluster'] == -1, 'cluster'] = knn.predict(self.get_np_embeddings(outliers)) #TODO check updates only on outlier
            return df
        #Fix outlier cluster
        df = fix_outliers_(df)
        # Fix small clusters
        cluster_counts = df['cluster'].value_counts()
        categories_less_than_3 = cluster_counts[cluster_counts < 3].index.tolist()
        df["cluster"] = df["cluster"].apply(lambda x: -1 if x in categories_less_than_3 else x)
        
        df = fix_outliers_(df)
        return df

    def print_clusters(self,df):
        for c in df["cluster"].unique():
            print(f"Cluster {c}")
            for r in df[df["cluster"] == c]["title"].tolist():
                print(r)


    def dbscan_clusters(self, embeddings,min_cluster_size):
        hdb = HDBSCAN(min_cluster_size=min_cluster_size,)
        hdb.fit_predict(embeddings)
        return hdb.labels_
    
    def get_np_embeddings(self, df):
        return df["embeddings"].apply(pd.Series).values

    def get_clusters(self, df, min_cluster_size = 2, use_umap = True):
        """
        Clusters articles based on their embeddings using HDBSCAN algorithm.

        Args:
            df (pd.DataFrame): DataFrame containing article data with embeddings
            min_cluster_size (int, optional): Minimum size of clusters. Defaults to 2.
            use_umap (bool, optional): Whether to use UMAP dimensionality reduction. Defaults to True.

        Returns:
            pd.DataFrame: DataFrame with cluster assignments added as 'cluster' column.
                         Outliers are assigned to nearest clusters using KNN.
        """
        logger.info(
            "Computing clusters",
            extra={
                'min_cluster_size': min_cluster_size,
                'use_umap' : use_umap
            }
        )
        df = df.dropna(axis = 0)
        if use_umap:
            reducer = umap.UMAP(random_state=42)
            umap_embedding = reducer.fit_transform(self.get_np_embeddings(df))
            df["embeddings"] = list(umap_embedding)
        clusters = self.dbscan_clusters(self.get_np_embeddings(df), min_cluster_size)
        df["cluster"] = clusters
        df = self.fix_outliers(df)
        logger.info(
            "Computed clusters",
            extra={
                'totals': df["cluster"].nunique()
            }
        )
        self.print_clusters(df)
        return df


    async def get_digest_embeddings(self, digest):
        """
        Generates embeddings for a digest using Azure OpenAI embeddings model.

        This function:
        1. Takes a digest dictionary containing title and content
        2. Gets the appropriate prompt template for digest embeddings
        3. Initializes the embeddings model
        4. Generates embeddings for the digest content
        5. Adds the embeddings to the digest dictionary

        Args:
            digest (dict): Dictionary containing digest information including title and content

        Returns:
            dict: Original digest with embeddings added, or None if embedding generation fails
        """
        try:
            logger.info(
                f"Creating digest embeddings for {digest['title']}",
                extra={
                    'title': digest["title"]
                }
            )
            fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.DIGEST_EMBEDDINGS)
            embedder = self.get_embedder(fuseprompt_embeddings)
            embeddings_instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt_embeddings, **digest)
            digest_embeddings = await embedder.aembed_query(embeddings_instructions)
            digest["embeddings"] = digest_embeddings
            logger.info(
                "Created digest embeddings",
                extra={
                    'title': digest["title"]
                }
            )
        except Exception as e:
            logger.error(
                f"Digest processing embeddings failed for {digest['title']}",
                extra= {
                    'title': digest["title"],
                    'error': str(e)
                })
            return None
        return digest


    async def get_cluster_digest(self, df_cluster):
        """
        Creates a digest for a cluster of articles using LLM and embeddings.
        
        This function:
        1. Takes a DataFrame containing articles from a single cluster
        2. Extracts key article information (title, summary, url, image)
        3. Uses LLM to generate digest sections summarizing the cluster
        4. Generates embeddings for each digest section
        5. Adds cluster ID and version metadata
        
        Args:
            df_cluster: DataFrame containing articles from one cluster
            
        Returns:
            List of digest sections with embeddings, or None if processing fails
        """
        cluster_id = df_cluster["cluster"].iloc[0]
        cluster_version = df_cluster["version"].iloc[0]
        logger.info(
                f"Creating cluster digest {cluster_id}",
                extra={
                    'cluster_id': cluster_id,
                    'cluster_version' : cluster_version
                }
            )
        try:

            cluster_articles_info = [{c:r[c] for c in ["title","summary","url","image"]} for i, r in df_cluster.iterrows()]
            
            fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.CLUSTER_DIGEST)
            llm = self.get_llm(fuseprompt)
            instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, cluster_articles = cluster_articles_info)
            daily_digest = await llm.ainvoke(instructions)
            embeddings_tasks = [self.get_digest_embeddings(dd) for dd in daily_digest['sections']]
            daily_digest_w_emb = await asyncio.gather(*embeddings_tasks)
            
            daily_digests = []
            for daily_digest_ in daily_digest_w_emb:
                daily_digest_["cluster"] = str(cluster_id)
                daily_digest_["version"] = str(cluster_version)
                if daily_digest_["embeddings"] is not None:
                    daily_digests.append(daily_digest_)

        except Exception as e:
            logger.error(
                f"Digest the cluster {cluster_id} failed",
                extra= {
                    'cluster_id': cluster_id,
                    'cluster_version': cluster_id,
                    'error': str(e)
                })
            return None
        logger.info(
                f"finished creating cluster digest {cluster_id}",
                extra={
                    'cluster_id': cluster_id,
                    'cluster_version' : cluster_version,
                    'total' : len(daily_digests),
                    'digest_errors' : len(daily_digest_w_emb) - len(daily_digests)
                }
            )
        return daily_digest_w_emb


    async def get_clusters_digest(self,cluster_df):
        """
        Processes multiple DataFrame clusters asynchronously and aggregates the results.
        
        :param cluster_dfs: List of DataFrame clusters
        :return: Aggregated list of daily digests
        """
        cluster_dfs = [cluster_df[cluster_df["cluster"] == c] for c in cluster_df["cluster"].unique()]
        logger.info(
            "Creating digests to clusters",
            extra={
                'number of clusters': len(cluster_dfs)
            }
        )
        tasks = [self.get_cluster_digest(df) for df in cluster_dfs]
        results = await asyncio.gather(*tasks)
        aggregated_list = []
        for result in results:
            if result is not None:
                aggregated_list.extend(result) 

        logger.info(
            "Created digests",
            extra={
                'number of digests': len(aggregated_list),
                'number of failed clusters digest': len(results) - len(aggregated_list)
            }
        )
        return aggregated_list

    async def get_lastest_articels(self, utcnow):
        last_24_hours = utcnow - timedelta(hours=24)
        logger.info(
            "Retrieving last 24 hours articles",
            extra={
                'end': str(utcnow),
                'start': str(last_24_hours)
            }
        )
        pipeline = [
            {
                '$match': {
                    "createdAt": {
                        "$gte": last_24_hours,
                        "$lte": utcnow
                    }
                }
            },
            {
                '$project': {
                    '_id': 1, 
                    'url': 1, 
                    'title': '$enrichment.title', 
                    'summary': '$enrichment.summary', 
                    'embeddings': 1, 
                    'image': 1
                }
            }
        ]
        articles = await self.mongodb.aggregate_articles(pipeline)
        articles_df = pd.DataFrame(articles)
        articles_df["version"] = str(utcnow)
        logger.info(
            "Retrived articles",
            extra={
                'total': articles_df.shape[0]
            }
        )
        return articles_df

    async def get_batch_digest(self):
        """
        Processes the latest articles from the last 24 hours, clusters them based on their embeddings,
        and generates digests for each cluster.

        Returns:
            list: A list of digest objects, where each digest contains:
                - A summary of the cluster's articles
                - The cluster ID
                - Version timestamp
                - Embeddings for the digest
        """
        

        utcnow = datetime.utcnow()
        logger.info(
            "Start batch digest",
            extra={
                'version': str(utcnow)
            }
        )

        articles_df = await self.get_lastest_articels(utcnow)
        clusters_df = self.get_clusters(articles_df)
        digests = await self.get_clusters_digest(clusters_df)

        logger.info(
            "Finished batch digest",
            extra={
                'version': str(utcnow)
            }
        )
        return digests

    async def get_daily_digest(self, reader_id: str):
        reader = await self.mongodb.get_reader(reader_id)
        pipeline = [
            {
                '$sort': {'createdAt': -1}  # Sort by version descending
            },
            {
                '$limit': 1  # Get only the latest document
            },
            {
                '$project': {
                    'version': 1,  # Return only the version field
                    '_id': 0
                }
            }
        ]
        latest_version = await self.mongodb.aggregate_digests(pipeline)[0]['version']

        query_filter = {
            "version": latest_version
        }
        vector_search = {
            '$vectorSearch': {
                'index': 'digest_embeddings',
                'path': 'embeddings',
                'queryVector': reader['embeddings'],
                'filter': query_filter,
                'numCandidates': 400,
                'limit': 100 
            }
        }

        pipeline = [
            vector_search,
            {
                '$project': {
                    '_id': 1
                }
            }
        ]
        
        daily_digest = await self.mongodb.aggregate_digests(pipeline) 
        return daily_digest
