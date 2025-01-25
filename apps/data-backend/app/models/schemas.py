from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class Topics(str, Enum):
    HEALTH = "health"
    SPORTS = "sports"
    POLITICS = "politics"
    MOVIE = "movie"
    TRAVEL = "travel"
    LEGAL = "legal"
    CLIMATE = "climate"
    RELATIONSHIPS = "relationships"
    MINDFULNESS = "mindfulness"
    NUTRITION = "nutrition"

# Request Models
class ReaderInterest(BaseModel):
    interest: str = Field(..., description="The specific interest of the reader")
    ranking: int = Field(..., ge=1, le=5, description="Ranking of the interest from 1-5")

    class Config:
        json_schema_extra = {
            "example": {
                "interest": "sports journalism",
                "ranking": 4
            }
        }

class ArticleRequest(BaseModel):
    title: str = Field(..., description="Title of the article")
    subtitle: str = Field(..., description="Subtitle of the article")
    content: str = Field(..., description="Content of the article")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "The Future of AI in Healthcare",
                "subtitle": "An exploration of how artificial intelligence is transforming medical diagnosis...",
                "content": "An exploration of how artificial intelligence is transforming medical diagnosis..."
            }
        }

class ReaderRequest(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Age of the reader")
    gender: str = Field(..., description="Gender of the reader")
    articles: List[Dict] = Field(..., description="List of articles read by the reader")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 35,
                "gender": "female",
                "articles": [{
                    "title": "The Future of AI in Healthcare",
                    "summary": "An exploration of how artificial intelligence is transforming medical diagnosis...",
                    "reader_interests": [
                        {"interest": "AI in medicine", "ranking": 5}
                    ],
                    "locations": ["United States"],
                    "concepts": ["artificial intelligence", "medical diagnosis"],
                    "topics": ["health"]
                }]
            }
        }

# Response Models
class ArticleResponse(BaseModel):
    title: str = Field(..., description="Processed title of the article")
    summary: str = Field(..., description="Processed summary of the article")
    reader_interests: List[str] = Field(..., description="Extracted reader interests")

    class Config:
        json_schema_extra = {
            "example": {
                "title": "AI Revolution in Healthcare: A Deep Dive",
                "summary": "A comprehensive analysis of AI's impact on medical diagnostics...",
                "reader_interests": ["healthcare technology", "AI applications", "medical innovation"]
            }
        }

class ReaderResponse(BaseModel):
    interests: List[str] = Field(..., description="Consolidated list of reader interests")
    summary: str = Field(..., description="Summary of reader profile")

    class Config:
        json_schema_extra = {
            "example": {
                "interests": ["healthcare technology", "medical innovation", "AI applications"],
                "summary": "A technology-oriented reader with strong interest in healthcare innovation..."
            }
        }

class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")

    class Config:
        json_schema_extra = {
            "example": {
                "error": "Processing Error",
                "details": "Failed to process article due to invalid format"
            }
        } 