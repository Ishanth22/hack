import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

client = None
db = None


def connect_db():
    global client, db
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    try:
        client.admin.command("ping")
        db = client["startup_monitor"]
        print("✅ Connected to MongoDB")
        _ensure_indexes()
    except ConnectionFailure:
        print("⚠️  MongoDB not available - using mock mode")
        db = None


def _ensure_indexes():
    if db is not None:
        db.startups.create_index("name")
        db.metrics.create_index("startup_id")
        db.metrics.create_index([("startup_id", 1), ("month", 1)], unique=True)


def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db():
    return db
