import os
from flask import g
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from dotenv import load_dotenv
from .fuse_prompt import FusePromptFacade, PromptName
from .mongodb import MongoDBService
from ..models.schemas import ArticleRequest as Article, ReaderRequest as Reader, ArticleResponse, ReaderResponse
from ..utils.logger import logger

load_dotenv()

class ProcessService:
    def __init__(self):
        self.fuse_prompt_facade = FusePromptFacade()
        self.mongodb = MongoDBService()

    def get_embedder(self,fuseprompt):
        logger.info(
            "Initializing Embedder",
            extra={
                'request_id': g.request_id,
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
                'request_id': g.request_id,
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


    def ingest_article(self, article: Article):
        logger.info(
            "Starting article ingestion",
            extra={
                'request_id': g.request_id,
                'article_title': article.title
            }
        )
        
        # Process with LLM
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.ARTICLE_INGEST_CHAT)
        llm = self.get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, **dict(article=article))[0]["content"]
        article_profile = llm.invoke(instructions)

        # Process Embeddings
        fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.ARTICLE_EMBEDDINGS)
        embedder = self.get_embedder(fuseprompt_embeddings)
        embeddings_instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt_embeddings, **article_profile)
        embeddings = embedder.embed_query(embeddings_instructions)
        logger.info(
            "Article ingestion completed",
            extra={
                'request_id': g.request_id,
                'article_title': article.title
            }
        )

        article_profile["embeddings"] = embeddings
        return article_profile

    def ingest_reader(self, reader: Reader):
        logger.info(
            "Starting reader ingestion",
            extra={
                'request_id': g.request_id,
                
            }
        )

        # Process with LLM
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.READER_PROFILER)
        llm = self.get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, **dict(reader=reader))
        reader_profile = llm.invoke(instructions)

        # Process Embeddings
        fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.READER_EMBEDDINGS)
        embedder = self.get_embedder(fuseprompt_embeddings)
        embeddings_instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt_embeddings, **reader_profile)
        embeddings = embedder.embed_query(embeddings_instructions)

        reader_profile["embeddings"] = embeddings

        logger.info(
            "Reader ingestion completed",
            extra={
                'request_id': g.request_id,
            }
        )
        return reader_profile

    def get_daily(self, reader):
        self.mongodb.get_article()
        #retreieve news
        pass