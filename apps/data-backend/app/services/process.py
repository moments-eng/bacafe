import json
import os
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from dotenv import load_dotenv
from .fuse_prompt import FusePromptFacade, PromptName
from .mongodb import MongoDBService
from ..utils.logger import logger
from datetime import datetime, timedelta
from typing import Dict, Any

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
