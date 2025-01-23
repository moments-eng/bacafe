import logging
import sys
import uuid
import os
from datetime import datetime
from typing import Any, Dict
from pythonjsonlogger import jsonlogger
import structlog

# Get environment mode
LOG_ENV = os.getenv('LOG_ENV', 'production')

class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        
        # Add custom fields
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        
        if not log_record.get('request_id'):
            log_record['request_id'] = str(uuid.uuid4())

def setup_logger(name: str = "app") -> logging.Logger:
    """Setup logger with different formatters based on environment"""
    logger = logging.getLogger(name)
    handler = logging.StreamHandler(sys.stdout)
    
    if LOG_ENV == 'development':
        # Development: Simple console formatter with colors
        formatter = logging.Formatter(
            '\033[36m%(asctime)s\033[0m - \033[32m%(name)s\033[0m - \033[1m%(levelname)s\033[0m - %(message)s'
        )
    else:
        # Production: JSON formatter
        formatter = CustomJsonFormatter(
            '%(timestamp)s %(level)s %(name)s %(request_id)s %(message)s'
        )
    
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    
    return logger

# Configure structlog based on environment
processors = [
    structlog.contextvars.merge_contextvars,
    structlog.processors.add_log_level,
    structlog.processors.TimeStamper(fmt="iso"),
]

if LOG_ENV == 'development':
    processors.extend([
        structlog.dev.ConsoleRenderer(colors=True)
    ])
else:
    processors.extend([
        structlog.processors.JSONRenderer()
    ])

structlog.configure(
    processors=processors,
    logger_factory=structlog.PrintLoggerFactory(),
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    cache_logger_on_first_use=True,
)

# Create main application logger
logger = setup_logger() 