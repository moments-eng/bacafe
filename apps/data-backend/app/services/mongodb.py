from typing import Dict, List, Optional, Any
import os
from ..utils.logger import logger
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

class MongoDBService:
    def __init__(self):
        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.client = AsyncIOMotorClient(mongodb_uri)
        self.db = self.client["bacafe"]
        self._ensure_indexes()

    async def _ensure_indexes(self):
        """Ensure all required indexes exist in MongoDB collections."""
        try:
            # Indexes for articles collection
            await self.db.articles.create_index([("createdAt", 1)])

            # Indexes for digests collection
            await self.db.digests.create_index([("createdAt", 1)])
            await self.db.digests.create_index([("version", 1)])
            await self.db.digests.create_index([("cluster", 1)])

            logger.info("MongoDB indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating MongoDB indexes: {str(e)}")
            raise

    async def aggregate_articles(self, pipeline: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Execute an aggregation pipeline on the articles collection."""
        try:
            cursor = self.db.articles.aggregate(pipeline)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error in MongoDB aggregation: {str(e)}")
            raise

    async def aggregate_digests(self, pipeline: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Execute an aggregation pipeline on the digests collection."""
        try:
            cursor = self.db.digests.aggregate(pipeline)
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error in MongoDB aggregation: {str(e)}")
            raise

    async def get_reader(self, reader_id: str) -> Dict[str, Any]:
        """
        Retrieve a reader by ID from the users collection.
        
        Args:
            reader_id: The ID of the reader (can be string or ObjectId string)
            
        Returns:
            Dict containing the reader data
            
        Raises:
            ValueError: If reader is not found
            Exception: For other database errors
        """
        try:
            # Try to find by string ID first
            reader = await self.db.users.find_one({"_id": ObjectId(reader_id)})
            
            if not reader:
                raise ValueError(f"Reader not found: {reader_id}")
                
            logger.info(
                "Reader found",
                extra={
                    'reader_id': reader_id
                }
            )
            return reader
            
        except ValueError:
            # Re-raise ValueError for not found cases
            raise
        except Exception as e:
            logger.error(
                "Error retrieving reader",
                extra={
                    'reader_id': reader_id,
                    'error': str(e)
                }
            )
            raise

    async def get_latest_digest_version(self) -> int:
        """
        Get the latest digest version (timestamp).
        
        Returns:
            int: Latest version timestamp in milliseconds since epoch
        """
        try:
            pipeline = [
                {
                    '$sort': {'version': -1}
                },
                {
                    '$limit': 1
                },
                {
                    '$project': {
                        'version': 1,
                        '_id': 0
                    }
                }
            ]
            
            result = await self.aggregate_digests(pipeline)
            if result and len(result) > 0:
                return result[0]['version']
            return 0
        except Exception as e:
            logger.error(f"Error getting latest digest version: {str(e)}")
            raise

    async def get_digest_status(self, version: int) -> Dict[str, Any]:
        """
        Get status of digests for a specific version.
        
        Args:
            version: Version timestamp in milliseconds since epoch
            
        Returns:
            Dict containing:
            - total_digests: Total number of digests for this version
            - clusters: Number of unique clusters
            - creation_time: Timestamp of first digest in this version
        """
        try:
            pipeline = [
                {
                    '$match': {
                        'version': version
                    }
                },
                {
                    '$group': {
                        '_id': None,
                        'total_digests': {'$sum': 1},
                        'clusters': {'$addToSet': '$cluster'},
                        'first_created': {'$min': '$createdAt'},
                        'last_created': {'$max': '$createdAt'}
                    }
                }
            ]
            
            result = await self.aggregate_digests(pipeline)
            if result and len(result) > 0:
                stats = result[0]
                return {
                    'version': version,
                    'total_digests': stats['total_digests'],
                    'unique_clusters': len(stats['clusters']),
                    'started_at': stats['first_created'],
                    'completed_at': stats['last_created']
                }
            return {
                'version': version,
                'total_digests': 0,
                'unique_clusters': 0,
                'started_at': None,
                'completed_at': None
            }
        except Exception as e:
            logger.error(f"Error getting digest status: {str(e)}")
            raise

    async def insert_digest(self, digest: Dict[str, Any]) -> str:
        """
        Insert a digest document into MongoDB.
        
        Args:
            digest: Dictionary containing digest data including:
                   - category, title, teaser, highlights, body
                   - articleLinks, imageUrl, readTime, mood
                   - embeddings, cluster, version (as milliseconds since epoch)
                   - createdAt
        
        Returns:
            str: The ID of the inserted digest document
        
        Raises:
            Exception: If the insertion fails
        """
        try:
            logger.info(
                "Inserting digest",
                extra={
                    'title': digest.get('title'),
                    'cluster': digest.get('cluster'),
                    'version': digest.get('version')
                }
            )
            
            result = await self.db.digests.insert_one(digest)
            
            logger.info(
                "Digest inserted successfully",
                extra={
                    'digest_id': str(result.inserted_id),
                    'title': digest.get('title'),
                    'cluster': digest.get('cluster'),
                    'version': digest.get('version')
                }
            )
            
            return str(result.inserted_id)
        except Exception as e:
            logger.error(
                "Failed to insert digest",
                extra={
                    'error': str(e),
                    'title': digest.get('title'),
                    'cluster': digest.get('cluster'),
                    'version': digest.get('version')
                }
            )
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

    # Cleanup
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close() 