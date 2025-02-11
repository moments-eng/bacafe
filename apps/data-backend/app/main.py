from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uuid
from .services.process import ProcessService
from .utils.logger import logger

app = FastAPI()
process_service = ProcessService()

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
        result = await process_service.ingest_article(article_data)
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
        result = await process_service.ingest_reader(reader_data)
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

@app.post("/api/daily-digest")
async def reader_daily_digest(request: Request):
    try:
        data = await request.json()
        logger.info(
            "Writing reader digest",
            extra={
                'request_id': request.state.request_id,
                'reader_id': data.get('reader_id')
            }
        )
        result = await process_service.get_daily(data.get('reader_id'))
        logger.info(
            "Reader digest processed successfully",
            extra={
                'request_id': request.state.request_id,
                'sections_count': len(result.get('sections', []))
            }
        )
        return result
    except Exception as e:
        logger.error(
            "Reader digest processing failed",
            extra={
                'request_id': request.state.request_id,
                'error': str(e)
            }
        )
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/batch-digest")
async def batch_digest(request: Request):
    try:
        data = await request.json()
        logger.info(
            "Computing batch digest",
            extra={
                'request_id': request.state.request_id
            }
        )
        result = await process_service.get_batch_digest()
        logger.info(
            "Batch digest processed successfully",
            extra={
                'request_id': request.state.request_id,
                'sections_count': len(result)
            }
        )
        return result
    except Exception as e:
        
        logger.error(
            "Batch digest processing failed",
            extra={
                'request_id': request.state.request_id,
                'error': str(e)
            }
        )
        print(e)
        raise HTTPException(status_code=500, detail=str(e))

