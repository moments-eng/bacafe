from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid
from .services.article_ingestion import ArticleIngestionService
from .services.reader_ingestion import ReaderIngestionService
from .services.digest import DigestService
from .utils.logger import logger

app = FastAPI()

# Initialize services
article_service = ArticleIngestionService()
reader_service = ReaderIngestionService()
digest_service = DigestService()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    logger.info(
        "Request started",
        extra={
            'request_id': request_id,
            'path': request.url.path
        }
    )
    response = await call_next(request)
    return response

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/ingest-article")
async def ingest_article(request: Request):
    try:
        article_data = await request.json()
        logger.info(
            "Processing article request",
            extra={
                'request_id': request.state.request_id,
                'article_title': article_data.get('title', 'Unknown Title')
            }
        )
        result = await article_service.process_article(article_data)
        logger.info(
            "Article processed successfully",
            extra={
                'request_id': request.state.request_id,
                'article_title': article_data.get('title', 'Unknown Title')
            }
        )
        return result
    except Exception as e:
        logger.error(
            "Article processing failed",
            extra={
                'request_id': request.state.request_id,
                'error': str(e)
            }
        )
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest-reader")
async def ingest_reader(request: Request):
    try:
        reader_data = await request.json()
        logger.info(
            "Processing reader request",
            extra={
                'request_id': request.state.request_id
            }
        )
        result = await reader_service.process_reader(reader_data)
        logger.info(
            "Reader processed successfully",
            extra={
                'request_id': request.state.request_id,
                'interests_count': len(result.get('interests', []))
            }
        )
        return result
    except Exception as e:
        logger.error(
            "Reader processing failed",
            extra={
                'request_id': request.state.request_id,
                'error': str(e)
            }
        )
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/daily-digest/{reader_id}")
async def get_daily_digest(reader_id: str, request: Request):
    """
    Get personalized daily digest for a reader.
    
    Args:
        reader_id: The ID of the reader to get digest for
        
    Returns:
        List of relevant digest sections for the reader
    """
    try:
        logger.info(
            "Fetching daily digest",
            extra={
                'request_id': request.state.request_id,
                'reader_id': reader_id
            }
        )
        result = await digest_service.get_daily_digest(reader_id)
        logger.info(
            "Daily digest fetched successfully",
            extra={
                'request_id': request.state.request_id,
                'reader_id': reader_id,
                'sections_count': len(result)
            }
        )
        return result
    except ValueError as e:
        # This will catch the "Reader not found" error from MongoDBService
        logger.error(
            "Reader not found",
            extra={
                'request_id': request.state.request_id,
                'reader_id': reader_id,
                'error': str(e)
            }
        )
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(
            "Failed to fetch daily digest",
            extra={
                'request_id': request.state.request_id,
                'reader_id': reader_id,
                'error': str(e)
            }
        )
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/batch-digest")
async def batch_digest(request: Request, background_tasks: BackgroundTasks):
    """
    Endpoint to trigger batch digest processing.
    Returns immediately with a request ID while processing continues in the background.
    """
    request_id = request.state.request_id
    logger.info(
        "Batch digest requested",
        extra={
            'request_id': request_id
        }
    )
    
    # Schedule the batch processing as a background task
    background_tasks.add_task(digest_service.process_batch_digest, request_id)
    
    return {
        "message": "Batch Requested",
        "request_id": request_id
    }

