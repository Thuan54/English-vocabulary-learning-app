from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from ml_server.models.ai_explained import WordExplainer



explain_router = APIRouter(
    prefix="/explain",
    tags=["Explaination"]
)

# Khai báo schema cho Request và Response
class ExplainRequest(BaseModel):
    word: str

class ExplainResponse(BaseModel):
    explanation: str



# Lazy init: tạo khi server đã sẵn sàng, tránh crash lúc import
_explainer: WordExplainer | None = None

def get_explainer() -> WordExplainer:
    global _explainer
    if _explainer is None:
        _explainer = WordExplainer()
    return _explainer

@explain_router.post("/", response_model=ExplainResponse)
async def explain_word(word : str):
    """
        Endpoint nhận từ vựng và trả về đoạn text giải thích từ AI.
    """
    try:
        result = get_explainer().explain(word)
        return {"explanation": result}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi giải nghĩa từ: {str(e)}"
        )