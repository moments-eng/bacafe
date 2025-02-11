from typing import Dict, Any
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import os
from .fuse_prompt import FusePromptFacade, PromptName
from ..utils.logger import logger
from .base_service import BaseService

class ReaderIngestionService(BaseService):
    def __init__(self):
        super().__init__()
        self.fuse_prompt_facade = FusePromptFacade()

    async def process_reader(self, reader_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a reader by:
        1. Using LLM to analyze and create reader profile
        2. Generating embeddings for the reader profile
        
        Args:
            reader_data: Dictionary containing reader information
            
        Returns:
            Dictionary containing the processed reader profile with embeddings
        """
        logger.info(
            "Starting reader ingestion"
        )

        # Process with LLM
        fuseprompt = self.fuse_prompt_facade.get_prompt(PromptName.READER_PROFILER)
        llm = self._get_llm(fuseprompt)
        instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt, reader=reader_data)
        reader_profile = await llm.ainvoke(instructions)

        # Process Embeddings
        fuseprompt_embeddings = self.fuse_prompt_facade.get_prompt(PromptName.READER_EMBEDDINGS)
        embedder = self._get_embedder(fuseprompt_embeddings)
        embeddings_instructions = self.fuse_prompt_facade.compile_prompt(fuseprompt_embeddings, **reader_profile)
        embeddings = await embedder.aembed_query(embeddings_instructions)

        reader_profile["embeddings"] = embeddings

        logger.info(
            "Reader ingestion completed"
        )
        return reader_profile 