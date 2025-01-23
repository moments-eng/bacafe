# Data Backend Service

A Flask-based backend service for processing articles and reader profiles using Azure OpenAI and Langfuse for prompt management.

## Features

- Article ingestion and analysis
- Reader profile processing
- Azure OpenAI integration
- Langfuse prompt management
- Health monitoring
- Docker support with health checks
- Gunicorn production server

## Prerequisites

- Python 3.11+
- Azure OpenAI account
- Langfuse account
- pip or poetry for dependency management

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
OPENAI_API_VERSION=2023-05-15
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
AZURE_OPENAI_KEY=your_azure_key
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=bacafe
```

## Local Development Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   python -m app.main
   ```

The server will start at `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns service health status
  - Response: `{"status": "healthy"}`

### Article Processing
- **POST** `/api/ingest-article`
  - Processes and analyzes an article
  - Request Body:
    ```json
    {
        "title": "string",
        "summary": "string",
        "reader_interests": [
            {
                "interest": "string",
                "ranking": "integer (1-5)"
            }
        ],
        "locations": ["string"],
        "concepts": ["string"],
        "topics": ["health", "sports", "politics", "movie", "travel", "legal", "climate", "relationships", "mindfulness", "nutrition"]
    }
    ```
  - Response:
    ```json
    {
        "title": "string",
        "summary": "string",
        "reader_interests": ["string"]
    }
    ```

### Reader Profile Processing
- **POST** `/api/ingest-reader`
  - Processes and analyzes reader profiles
  - Request Body:
    ```json
    {
        "age": "integer",
        "gender": "string",
        "articles": [
            {
                "title": "string",
                "summary": "string",
                "reader_interests": [
                    {
                        "interest": "string",
                        "ranking": "integer (1-5)"
                    }
                ],
                "locations": ["string"],
                "concepts": ["string"],
                "topics": ["string"]
            }
        ]
    }
    ```
  - Response:
    ```json
    {
        "interests": ["string"],
        "summary": "string"
    }
    ```

## Docker Support

### Building the Docker Image
```bash
docker build -t data-backend .
```

### Running with Docker
```bash
docker run -p 3000:3000 --env-file .env data-backend
```

The container includes health checks that monitor the `/health` endpoint every 30 seconds.

### Checking Container Health
```bash
docker ps
```

Look for the STATUS column to see the container's health status.

## Production Deployment

The service uses Gunicorn as the production server with the following configuration:
- 4 worker processes
- 2 threads per worker
- Health monitoring
- Non-root user for security

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Successful operation
- 500: Internal server error with details in the response body

Error Response Format:
```json
{
    "error": "string",
    "details": "string"
}
```

## Logging

The service includes structured logging with request IDs for tracing and monitoring. Logs include:
- Request processing
- Article and reader ingestion events
- Error details
- Health status

## Security Features

- Non-root Docker user
- Environment variable configuration
- No sensitive data in logs
- Regular security updates via base image

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license here] 