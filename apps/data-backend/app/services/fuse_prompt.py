from enum import Enum
from langfuse import Langfuse
from typing import Any, Dict

class PromptName(Enum):
    ARTICLE_INGESTION = "article_ingestion"
    READER_PROFILER = "reader_profiler"
    ARTICLE_INGEST_CHAT = "article_ingest_chat"

class FusePromptFacade:
    def __init__(self):
        self.langfuse = Langfuse()

    def get_prompt(self, prompt_name: PromptName) -> Any:
        return self.langfuse.get_prompt(prompt_name.value)

    @staticmethod
    def compile_prompt(prompt: Any, **kwargs) -> Dict:
        return prompt.compile(**kwargs) 