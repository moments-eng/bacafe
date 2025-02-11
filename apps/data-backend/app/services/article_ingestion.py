from typing import Dict, Any
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import os
from .fuse_prompt import FusePromptFacade, PromptName
from ..utils.logger import logger
from .base_service import BaseService

class ArticleIngestionService(BaseService):
    def __init__(self):
        self.fuse_prompt_facade = FusePromptFacade()

    async def process_article(self, article_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process an article by:
        1. Using LLM to analyze and enrich article content
        2. Generating embeddings for the enriched content
        
        Args:
            article_data: Dictionary containing article information (title, content, etc.)
            
        Returns:
            Dictionary containing the processed article with enrichments and embeddings
        """
        logger.info(
            "Starting article ingestion",
            extra={
                'article_title': article_data.get('title', 'Unknown Title')
            }
        )
        
        # Process with LLM
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.ARTICLE_INGEST_CHAT)
        llm = self._get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, article=article_data)[0]["content"]
        article_profile = await llm.ainvoke(instructions)

        # Process Embeddings
        fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.ARTICLE_EMBEDDINGS)
        embedder = self._get_embedder(fuseprompt_embeddings)
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