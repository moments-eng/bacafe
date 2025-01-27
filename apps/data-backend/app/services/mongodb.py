from typing import Dict, List, Optional, Any
from pymongo import MongoClient, ASCENDING, DESCENDING
import os
from ..utils.logger import logger
from flask import g

class MongoDBService:
    def __init__(self):
        self.client = None
        self.db = None
        self.init_db()

    def init_db(self):
        """Initialize MongoDB connection"""
        try:
            mongodb_url = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
            self.client = MongoClient(mongodb_url)
            self.db = self.client[os.getenv('MONGODB_DB', 'articles_db')]
            logger.info("MongoDB connection initialized")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {str(e)}")
            raise

    def create_indexes(self):
        """Create necessary indexes"""
        try:
            # Articles collection indexes
            self.db.articles.create_index([("title", ASCENDING)], unique=True)
            self.db.articles.create_index([("topics", ASCENDING)])
            self.db.articles.create_index([("created_at", DESCENDING)])

            # Readers collection indexes
            self.db.readers.create_index([("age", ASCENDING)])
            self.db.readers.create_index([("gender", ASCENDING)])

            logger.info(
                "MongoDB indexes created",
                extra={'request_id': getattr(g, 'request_id', None)}
            )
        except Exception as e:
            logger.error(
                "Failed to create MongoDB indexes",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'error': str(e)
                }
            )
            raise

    # Article operations
    def insert_article(self, article: Dict) -> str:
        """Insert a new article"""
        try:
            result = self.db.articles.insert_one(article)
            logger.info(
                "Article inserted",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'article_id': str(result.inserted_id)
                }
            )
            return str(result.inserted_id)
        except Exception as e:
            logger.error(
                "Failed to insert article",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'error': str(e)
                }
            )
            raise

    def get_article(self, article_id: str) -> Optional[Dict]:
        """Retrieve an article by ID"""
        try:
            article = self.db.articles.find_one({"_id": article_id})
            return article
        except Exception as e:
            logger.error(
                "Failed to retrieve article",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'article_id': article_id,
                    'error': str(e)
                }
            )
            raise

    def get_articles_by_topic(self, topic: str, limit: int = 10) -> List[Dict]:
        """Retrieve articles by topic"""
        try:
            cursor = self.db.articles.find({"topics": topic}).limit(limit)
            return list(cursor)
        except Exception as e:
            logger.error(
                "Failed to retrieve articles by topic",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'topic': topic,
                    'error': str(e)
                }
            )
            raise

    # Reader operations
    def insert_reader(self, reader: Dict) -> str:
        """Insert a new reader"""
        try:
            result = self.db.users.insert_one(reader)
            logger.info(
                "Reader inserted",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'reader_id': str(result.inserted_id)
                }
            )
            return str(result.inserted_id)
        except Exception as e:
            logger.error(
                "Failed to insert reader",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'error': str(e)
                }
            )
            raise

    def get_reader(self, reader_id: str) -> Optional[Dict]:
        """Retrieve a reader by ID"""
        try:
            reader = self.db.users.find_one({"_id": ObjectId(reader_id)})
            return reader
        except Exception as e:
            logger.error(
                "Failed to retrieve reader",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'reader_id': reader_id,
                    'error': str(e)
                }
            )
            raise

    def update_reader_interests(self, reader_id: str, interests: List[str]) -> bool:
        """Update reader interests"""
        try:
            result = self.db.users.update_one(
                {"_id": reader_id},
                {"$set": {"interests": interests}}
            )
            success = result.modified_count > 0
            if success:
                logger.info(
                    "Reader interests updated",
                    extra={
                        'request_id': getattr(g, 'request_id', None),
                        'reader_id': reader_id
                    }
                )
            return success
        except Exception as e:
            logger.error(
                "Failed to update reader interests",
                extra={
                    'request_id': getattr(g, 'request_id', None),
                    'reader_id': reader_id,
                    'error': str(e)
                }
            )
            raise

    # Cleanup
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close() 