from pymongo import MongoClient
from datetime import datetime
import os

# 🔐 Replace with your Atlas connection string
MONGO_URI = "mongodb+srv://podcastadmin:podcast123@cluster0.fzmzeig.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)

db = client["podcast_ai"]
episodes_collection = db["episodes"]


def save_episode(theme, topic, outline, script):
    episode = {
        "theme": theme,
        "topic": topic,
        "outline": outline,
        "script": script,
        "created_at": datetime.utcnow()
    }

    result = episodes_collection.insert_one(episode)
    return str(result.inserted_id)


def get_recent_episodes(limit=3):
    return list(
        episodes_collection.find().sort("created_at", -1).limit(limit)
    )