from functools import wraps
import uuid
from flask import request, g
from ..utils.logger import logger

def request_context_middleware():
    """Middleware to add request context to each request"""
    request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
    g.request_id = request_id
    logger.info(
        "Request started",
        extra={
            'request_id': request_id,
            'method': request.method,
            'path': request.path,
            'remote_addr': request.remote_addr
        }
    )

def log_request(f):
    """Decorator to log request details"""
    @wraps(f)
    def decorated(*args, **kwargs):
        request_context_middleware()
        try:
            response = f(*args, **kwargs)
            logger.info(
                "Request completed",
                extra={
                    'request_id': g.request_id,
                    'status_code': response.status_code
                }
            )
            return response
        except Exception as e:
            logger.error(
                "Request failed",
                extra={
                    'request_id': g.request_id,
                    'error': str(e)
                }
            )
            raise
    return decorated 