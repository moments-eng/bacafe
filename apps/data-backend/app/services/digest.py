from time import timezone
from typing import Dict, Any, List, Optional
import pandas as pd
from datetime import datetime, timedelta
import asyncio
import time
from .base_service import BaseService
from .clustering import ClusteringService
from .mongodb import MongoDBService
from .fuse_prompt import PromptName
from ..utils.logger import logger

class DigestEntity:
    def __init__(self, 
                 category: str,
                 title: str,
                 teaser: str,
                 highlights: List[str],
                 body: List[str],
                 article_links: List[str],
                 image_url: str,
                 read_time: int,
                 mood: str,
                 embeddings: List[float],
                 cluster: str,
                 version: int):
        self.category = category
        self.title = title
        self.teaser = teaser
        self.highlights = highlights
        self.body = body
        self.article_links = article_links
        self.image_url = image_url
        self.read_time = read_time
        self.mood = mood
        self.embeddings = embeddings
        self.cluster = cluster
        self.version = version

    def to_dict(self) -> Dict[str, Any]:
        return {
            "category": self.category,
            "title": self.title,
            "teaser": self.teaser,
            "highlights": self.highlights,
            "body": self.body,
            "articleLinks": self.article_links,
            "imageUrl": self.image_url,
            "readTime": self.read_time,
            "mood": self.mood,
            "embeddings": self.embeddings,
            "cluster": self.cluster,
            "version": self.version,
            "createdAt": datetime.utcnow()
        }

class DigestService(BaseService):
    def __init__(self):
        super().__init__()
        self.clustering_service = ClusteringService()
        self.mongodb = MongoDBService()

    def _get_current_version(self) -> int:
        """Get current version as milliseconds since epoch."""
        return int(time.time() * 1000)

    async def get_latest_articles(self, version: int) -> pd.DataFrame:
        """Retrieve articles from the last 24 hours."""
        utcnow = datetime.utcnow()
        last_24_hours = utcnow - timedelta(hours=24)
        logger.info(
            "Retrieving last 24 hours articles",
            extra={
                'end': str(utcnow),
                'start': str(last_24_hours),
                'version': version
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
        articles_df["version"] = version
        
        logger.info(
            "Retrieved articles",
            extra={
                'total': articles_df.shape[0],
                'version': version
            }
        )
        return articles_df

    async def get_cluster_digest(self, df_cluster: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Create a digest for a cluster of articles using LLM and embeddings.
        
        Args:
            df_cluster: DataFrame containing articles from one cluster
            
        Returns:
            List of digest sections with embeddings
        """
        cluster_id = df_cluster["cluster"].iloc[0]
        cluster_version = int(df_cluster["version"].iloc[0])  # Ensure version is int
        
        logger.info(
            f"Creating cluster digest {cluster_id}",
            extra={
                'cluster_id': cluster_id,
                'cluster_version': cluster_version
            }
        )
        
        try:
            # Extract article information for the LLM
            cluster_articles_info = [{c:r[c] for c in ["title","summary","url","image"]} 
                                   for i, r in df_cluster.iterrows()]
            
            # Generate digest using LLM
            fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.CLUSTER_DIGEST)
            llm = self._get_llm(fuseprompt)
            instructions = self.fuse_prompt_facade.compile_prompt(
                fuseprompt, 
                cluster_articles=cluster_articles_info
            )
            daily_digest = await llm.ainvoke(instructions)
            
            # Generate embeddings for each digest section
            embeddings_tasks = [self._get_digest_embeddings(dd) for dd in daily_digest['sections']]
            daily_digest_w_emb = await asyncio.gather(*embeddings_tasks)
            
            # Add cluster metadata and filter out failed embeddings
            daily_digests = []
            for daily_digest_ in daily_digest_w_emb:
                if daily_digest_ and daily_digest_["embeddings"] is not None:
                    daily_digest_["cluster"] = str(cluster_id)
                    daily_digest_["version"] = cluster_version  # Keep as number
                    daily_digests.append(daily_digest_)

        except Exception as e:
            logger.error(
                f"Digest for cluster {cluster_id} failed",
                extra={
                    'cluster_id': cluster_id,
                    'cluster_version': cluster_version,
                    'error': str(e)
                }
            )
            return None
            
        logger.info(
            f"Finished creating cluster digest {cluster_id}",
            extra={
                'cluster_id': cluster_id,
                'cluster_version': cluster_version,
                'total': len(daily_digests),
                'digest_errors': len(daily_digest_w_emb) - len(daily_digests)
            }
        )
        return daily_digests

    async def _get_digest_embeddings(self, digest: Dict[str, Any]) -> Dict[str, Any]:
        """Generate embeddings for a digest section."""
        try:
            logger.info(
                f"Creating digest embeddings",
                extra={
                    'title': digest["title"]
                }
            )
            
            fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.DIGEST_EMBEDDINGS)
            embedder = self._get_embedder(fuseprompt_embeddings)
            embeddings_instructions = self.fuse_prompt_facade.compile_prompt(
                fuseprompt_embeddings, 
                **digest
            )
            digest_embeddings = await embedder.aembed_query(embeddings_instructions)
            digest["embeddings"] = digest_embeddings
            
            logger.info(
                "Created digest embeddings",
                extra={
                    'title': digest["title"]
                }
            )
            return digest
            
        except Exception as e:
            logger.error(
                f"Digest embeddings failed",
                extra={
                    'title': digest["title"],
                    'error': str(e)
                }
            )
            return None

    async def process_cluster_job(self, cluster_df: pd.DataFrame, request_id: str) -> None:
        """
        Process a single cluster job:
        1. Generate digest for the cluster
        2. Convert results to DigestEntity
        3. Store in database
        
        Args:
            cluster_df: DataFrame containing articles from one cluster
            request_id: Request ID for logging correlation
        """
        try:
            cluster_id = cluster_df["cluster"].iloc[0]
            version = int(cluster_df["version"].iloc[0])  # Ensure version is int
            
            logger.info(
                "Processing cluster job",
                extra={
                    "request_id": request_id,
                    "cluster": cluster_id,
                    "version": version,
                    "articles_count": len(cluster_df)
                }
            )
            
            digests = await self.get_cluster_digest(cluster_df)
            if digests:
                for digest in digests:
                    # Convert the digest to our entity format
                    digest_entity = DigestEntity(
                        category=digest.get("category", ""),
                        title=digest.get("title", ""),
                        teaser=digest.get("teaser", ""),
                        highlights=digest.get("highlights", []),
                        body=digest.get("body", []),
                        article_links=digest.get("articleLinks", []),
                        image_url=digest.get("imageUrl", ""),
                        read_time=digest.get("readTime", -1),
                        mood=digest.get("mood", "neutral"),
                        embeddings=digest.get("embeddings", []),
                        cluster=str(cluster_id),
                        version=version  # Use the int version
                    )
                    
                    # Store in database
                    await self.mongodb.insert_digest(digest_entity.to_dict())
                
                logger.info(
                    "Completed cluster job",
                    extra={
                        "request_id": request_id,
                        "cluster": cluster_id,
                        "version": version,
                        "digests_created": len(digests)
                    }
                )
        except Exception as e:
            logger.error(
                "Cluster job failed",
                extra={
                    "request_id": request_id,
                    "cluster": cluster_df["cluster"].iloc[0],
                    "version": int(cluster_df["version"].iloc[0]),
                    "error": str(e)
                }
            )

    async def process_batch_digest(self, request_id: str) -> None:
        """
        Process the batch digest job:
        1. Retrieve latest articles
        2. Cluster them
        3. Launch separate tasks for each cluster
        
        Args:
            request_id: Request ID for logging correlation
        """
        version = self._get_current_version()
        logger.info(
            "Starting batch digest",
            extra={
                "request_id": request_id,
                "version": version
            }
        )

        try:
            # Get latest articles
            articles_df = await self.get_latest_articles(version)
            if articles_df.empty:
                logger.info(
                    "No articles found for processing",
                    extra={
                        "request_id": request_id,
                        "version": version
                    }
                )
                return

            # Cluster articles
            clusters_df = self.clustering_service.get_clusters(articles_df)
            unique_clusters = clusters_df["cluster"].unique()
            
            logger.info(
                "Launching cluster jobs",
                extra={
                    "request_id": request_id,
                    "version": version,
                    "total_clusters": len(unique_clusters)
                }
            )

            # Create tasks for each cluster
            tasks = []
            for cluster in unique_clusters:
                cluster_df = clusters_df[clusters_df["cluster"] == cluster]
                task = asyncio.create_task(
                    self.process_cluster_job(cluster_df, request_id)
                )
                tasks.append(task)

            # Wait for all cluster jobs to complete
            await asyncio.gather(*tasks)
            
            logger.info(
                "Completed batch digest processing",
                extra={
                    "request_id": request_id,
                    "version": version,
                    "total_clusters_processed": len(unique_clusters)
                }
            )
        except Exception as e:
            logger.error(
                "Batch digest processing failed",
                extra={
                    "request_id": request_id,
                    "version": version,
                    "error": str(e)
                }
            )
            raise

    async def get_daily_digest(self, reader_id: str) -> List[str]:
        """
        Get personalized daily digest for a reader based on their profile.
        
        Args:
            reader_id: The ID of the reader
            
        Returns:
            List of digest IDs (as strings) relevant for the reader
        """
        # Get reader profile
        reader = await self.mongodb.get_reader(reader_id)
        
        latest_version = await self.mongodb.get_latest_digest_version()

        vector_search = {
            '$vectorSearch': {
                'index': 'digest_embeddings',
                'path': 'embeddings',
                'queryVector': reader['embeddings'],
                'filter': {
                    'version': latest_version
                },
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
            },
        ]
        
        daily_digest = await self.mongodb.aggregate_digests(pipeline)
        return [str(doc['_id']) for doc in daily_digest]  # Return array of string IDs 