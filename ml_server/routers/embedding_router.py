from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from models.embed import Embed


router = APIRouter(
    prefix="/embedding",
    tags=["Embedding"]
)

class EmbeddingRequest(BaseModel):
    word: str

class EmbeddingResponse(BaseModel):
    embedding: list[float]


@router.post("/", response_model=EmbeddingResponse)
async def processEmbedding(req: EmbeddingRequest):
    """
        Endpoint nhận từ của người dùng và trả về vector embedding của từ đó.
    """
    try:
        embedder = Embed()
        embedding = embedder.embed_text(req.word)

        return {
            "embedding": embedding
        }

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi máy chủ nội bộ: {str(e)}"
        )