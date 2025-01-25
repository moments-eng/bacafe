from enum import Enum
from langfuse import Langfuse
from typing import Any, Dict

class PromptName(Enum):
    ARTICLE_INGESTION = "article_ingestion"
    READER_PROFILER = "reader_profiler"
    ARTICLE_INGEST_CHAT = "article_ingest_chat"

    READER_EMBEDDINGS = "reader_embedder_general"
    ARTICLE_EMBEDDINGS = "article_embedder"

class FusePromptFacade:
    def __init__(self):
        self.langfuse = Langfuse()

    def get_prompt(self, prompt_name: PromptName) -> Any:
        return self.langfuse.get_prompt(prompt_name.value)

    @staticmethod
    def compile_prompt(prompt: Any, **kwargs) -> str:
        return prompt.compile(**kwargs) 