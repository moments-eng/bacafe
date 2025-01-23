import os
from flask import g
from langchain_openai import AzureChatOpenAI
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
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, article=article)[0]["content"]
        answer = llm.invoke(instructions)
        
        logger.info(
            "Article ingestion completed",
            extra={
                'request_id': g.request_id,
                'article_title': article.title
            }
        )
        return answer

    def ingest_reader(self, reader: Reader):
        logger.info(
            "Starting reader ingestion",
            extra={
                'request_id': g.request_id,
                'reader_age': reader.age
            }
        )
        
        # Process with LLM
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.READER_PROFILER)
        llm = self.get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, reader=reader)
        answer = llm.invoke(instructions)
        
        # Store in MongoDB
        reader_data = {
            "age": reader.age,
            "gender": reader.gender,
            "interests": answer.get('interests', []),
            "summary": answer.get('summary', ''),
            "articles": [article.dict() for article in reader.articles]
        }
        
        self.mongodb.insert_reader(reader_data)
        
        logger.info(
            "Reader ingestion completed",
            extra={
                'request_id': g.request_id,
                'reader_age': reader.age
            }
        )
        return answer 