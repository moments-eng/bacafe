from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import os
from .fuse_prompt import FusePromptFacade
from ..utils.logger import logger

class BaseService:
    def __init__(self):
        self.fuse_prompt_facade = FusePromptFacade()

    def _get_embedder(self, fuseprompt):
        """Initialize and return an Azure OpenAI embeddings model."""
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

    def _get_llm(self, fuseprompt):
        """Initialize and return an Azure OpenAI LLM."""
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