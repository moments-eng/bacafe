import requests

from app.models.schemas import (
    ReaderRequest,
    ArticleRequest,
    ErrorResponse
)
from app.services.process import ProcessService

# response = requests.post("http://localhost:3000/api/ingest-reader", json  = {
#                 "age": 35,
#                 "gender": "female",
#                 "articles": [{
#                     "title": "The Future of AI in Healthcare",
#                     "summary": "An exploration of how artificial intelligence is transforming medical diagnosis...",
#                     "reader_interests": [
#                         {"interest": "AI in medicine", "ranking": 5}
#                     ],
#                     "locations": ["United States"],
#                     "concepts": ["artificial intelligence", "medical diagnosis"],
#                     "topics": ["health"]
#                 }]})




# response = requests.post("http://localhost:3000/api/ingest-article", json = {
#                 "title": "The Future of AI in Healthcare",
#                 "subtitle": "An exploration of how artificial intelligence is transforming medical diagnosis...",
#                 "content": "An exploration of how artificial intelligence is transforming medical diagnosis..."
#             })
# print(response)

print("start")
response = requests.post("http://localhost:3000/api/batch-digest", json = {"data" : "data"})
print(response)

