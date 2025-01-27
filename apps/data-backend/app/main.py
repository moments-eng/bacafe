from flask import Flask, jsonify, g, request
from .models.schemas import (
    ReaderRequest, 
    ArticleRequest, 
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
                'article_title': data.get('title')
            }
        )
        return jsonify(result), 200
    except Exception as e:
        print(e)
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
                'request_id': g.request_id
            }
        )
        result = process_service.ingest_reader(data)
        logger.info(
            "Reader processed successfully",
            extra={
                'request_id': g.request_id,
                'interests_count': len(result.get('interests', []))
            }
        )
        return jsonify(result)
    except Exception as e:
        print(e)
        logger.error(
            "Reader processing failed",
            extra={
                'request_id': g.request_id,
                'error': str(e)
            }
        )
        error = ErrorResponse(error="Processing Error", details=str(e))
        return jsonify(error.dict()), 500


@app.route('/api/daily-digest', methods=['POST'])
@log_request
def reader_daily_digest():
    try:
        data = request.get_json()
        logger.info(
            "Writing reader digest",
            extra={
                'request_id': g.request_id,
                'reader_id': data.get('reader_id')
            }
        )
        result = process_service.get_daily(data.get('reader_id'))
        logger.info(
            "Reader digest processed successfully",
            extra={
                'request_id': g.request_id,
                'sections_count': len(result.get('sections', []))
            }
        )
        return jsonify(result)
    except Exception as e:
        logger.error(
            "Reader digest processing failed",
            extra={
                'request_id': g.request_id,
                'error': str(e)
            }
        )
        error = ErrorResponse(error="Processing Error", details=str(e))
        return jsonify(error.dict()), 500

