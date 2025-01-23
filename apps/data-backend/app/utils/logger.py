import logging
import sys
import uuid
from datetime import datetime
from typing import Any, Dict
from pythonjsonlogger import jsonlogger
import structlog

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
    """Setup JSON logger with custom formatting"""
    logger = logging.getLogger(name)
    handler = logging.StreamHandler(sys.stdout)
    
    formatter = CustomJsonFormatter(
        '%(timestamp)s %(level)s %(name)s %(request_id)s %(message)s'
    )
    
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    
    return logger

# Create structured logger for application events
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.PrintLoggerFactory(),
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    cache_logger_on_first_use=True,
)

# Create main application logger
logger = setup_logger() 