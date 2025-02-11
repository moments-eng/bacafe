from typing import Dict, List, Optional, Any
from pymongo import ASCENDING, DESCENDING
import os
from ..utils.logger import logger
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class MongoDBService:
    def __init__(self):
        mongodb_uri = os.getenv("MONGODB_URI")
        if not mongodb_uri:
            raise ValueError("MONGODB_URI environment variable is not set")
            
        db_name = os.getenv("MONGODB_DB_NAME", "bacafe")
        logger.info(f"Connecting to MongoDB database: {db_name}")
        
        self.client = AsyncIOMotorClient(mongodb_uri)
        self.db = self.client[db_name]
        self.init_db()

    def init_db(self):
        """Initialize MongoDB connection"""
        try:
            logger.info("MongoDB connection initialized")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {str(e)}")
            raise

    async def create_indexes(self):
        """Create necessary indexes"""
        try:
            # Articles collection indexes
            await self.db.articles.create_index([("title", ASCENDING)], unique=True)
            await self.db.articles.create_index([("topics", ASCENDING)])
            await self.db.articles.create_index([("created_at", DESCENDING)])

            # Readers collection indexes
            await self.db.readers.create_index([("age", ASCENDING)])
            await self.db.readers.create_index([("gender", ASCENDING)])

            logger.info("MongoDB indexes created")
        except Exception as e:
            logger.error(f"Failed to create MongoDB indexes: {str(e)}")
            raise

    # Article operations
    async def insert_article(self, article_data):
        """Insert a new article"""
        try:
            result = await self.db.articles.insert_one(article_data)
            logger.info(f"Article inserted with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Failed to insert article: {str(e)}")
            raise

    async def get_article(self, article_id: str) -> Optional[Dict]:
        """Retrieve an article by ID"""
        try:
            article = await self.db.articles.find_one({"_id": article_id})
            return article
        except Exception as e:
            logger.error(f"Failed to retrieve article {article_id}: {str(e)}")
            raise

    async def get_articles_by_topic(self, topic: str, limit: int = 10) -> List[Dict]:
        """Retrieve articles by topic"""
        try:
            cursor = self.db.articles.find({"topics": topic}).limit(limit)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Failed to retrieve articles by topic {topic}: {str(e)}")
            raise

    # Reader operations
    async def insert_reader(self, reader_data):
        """Insert a new reader"""
        try:
            result = await self.db.readers.insert_one(reader_data)
            logger.info(f"Reader inserted with ID: {result.inserted_id}")
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Failed to insert reader: {str(e)}")
            raise

    async def get_reader(self, reader_id: str) -> Optional[Dict]:
        """Retrieve a reader by ID"""
        try:
            reader = await self.db.readers.find_one({"_id": reader_id})
            return reader
        except Exception as e:
            logger.error(f"Failed to retrieve reader {reader_id}: {str(e)}")
            raise

    async def update_reader_interests(self, reader_id: str, interests: List[str]) -> bool:
        """Update reader interests"""
        try:
            result = await self.db.readers.update_one(
                {"_id": reader_id},
                {"$set": {"interests": interests}}
            )
            success = result.modified_count > 0
            if success:
                logger.info(f"Reader {reader_id} interests updated")
            return success
        except Exception as e:
            logger.error(f"Failed to update reader {reader_id} interests: {str(e)}")
            raise

    async def aggregate_articles(self, pipeline):
        try:
            cursor = self.db.articles.aggregate(pipeline)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Failed to aggregate articles: {str(e)}")
            raise

    # Cleanup
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close() 
    
    async def aggregate_digests(self, pipeline):
        #TODO check schema
        try:
            cursor = self.db.daily_digest.aggregate(pipeline)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Failed to aggregate digests: {str(e)}")
            raise