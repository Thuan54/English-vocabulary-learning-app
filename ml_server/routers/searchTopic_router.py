from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import numpy as np

from models.embed import Embed


MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "vocabulary-app"

try:
    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client[DB_NAME]
    words_collection = db["words"]
except Exception as e:
    print("Lỗi kết nối MongoDB từ Python:", e)

router = APIRouter(prefix="/search", tags=["Search"])

class SearchRequest(BaseModel):
    topic: str
    top_k: int = 20


embedder = Embed()


@router.post("/")
async def search_topic(req: SearchRequest):
    try:
        # 1. Embed topic thành vector
        topic_vector = embedder.embed_text(req.topic)
        topic_np = np.array(topic_vector)

        # 2. Lấy toàn bộ từ vựng đã có vector từ MongoDB
        cursor = words_collection.find(
            {"embedding": {"$exists": True}},
            {"_id": 1, "embedding": 1}
        )
        words_data = list(cursor)

        if not words_data:
            return {"top_results": []}

        results = []

        # 3. Tính Cosine Similarity bằng Numpy
        for item in words_data:
            word_np = np.array(item["embedding"])

            # Công thức Cosine Similarity
            similarity = np.dot(topic_np, word_np) / (
                np.linalg.norm(topic_np) * np.linalg.norm(word_np)
            )

            results.append({
                "wordId": str(item["_id"]),
                "score": float(similarity)
            })

        # 4. Sắp xếp giảm dần và lấy Top K
        results.sort(key=lambda x: x["score"], reverse=True)
        top_results = results[:req.top_k]

        return {"top_results": top_results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
