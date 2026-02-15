from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

# Lazy connection - only connect when needed
_client = None
_db = None

def get_client():
    global _client
    if _client is None:
        _client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    return _client

def get_db():
    global _db
    if _db is None:
        _db = get_client().portafolioAI
    return _db

# For backwards compatibility, expose db as a module-level property
class _DBProxy:
    def __getattr__(self, name):
        return getattr(get_db(), name)

db = _DBProxy()
