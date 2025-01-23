from flask import Flask, jsonify, g, request
from flask_pydantic import validate
from .models.schemas import (
    ReaderRequest, 
    ArticleRequest, 
    ArticleResponse, 
    ReaderResponse, 
    ErrorResponse
)
from .services.process import ProcessService
from .utils.logger import logger
from .middleware.request_context import log_request

app = Flask(__name__)
process_service = ProcessService()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/ingest-article', methods=['POST'])
@log_request
def ingest_article():
    try:
        data = request.get_json()
        logger.info(
            "Processing article request",
            extra={
                'request_id': g.request_id,
                'article_title': data.get('title')
            }
        )
        result = process_service.ingest_article(ArticleRequest(**data))
        logger.info(
            "Article processed successfully",
            extra={
                'request_id': g.request_id,
                'article_title': result.title
            }
        )
        return jsonify(result.dict())
    except Exception as e:
        logger.error(
            "Article processing failed",
            extra={
                'request_id': g.request_id,
                'error': str(e)
            }
        )
        error = ErrorResponse(error="Processing Error", details=str(e))
        return jsonify(error.dict()), 500

@app.route('/api/ingest-reader', methods=['POST'])
@log_request
def ingest_reader():
    try:
        data = request.get_json()
        logger.info(
            "Processing reader request",
            extra={
                'request_id': g.request_id,
                'reader_age': data.get('age')
            }
        )
        result = process_service.ingest_reader(ReaderRequest(**data))
        logger.info(
            "Reader processed successfully",
            extra={
                'request_id': g.request_id,
                'interests_count': len(result.interests)
            }
        )
        return jsonify(result.dict())
    except Exception as e:
        logger.error(
            "Reader processing failed",
            extra={
                'request_id': g.request_id,
                'error': str(e)
            }
        )
        error = ErrorResponse(error="Processing Error", details=str(e))
        return jsonify(error.dict()), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000) 