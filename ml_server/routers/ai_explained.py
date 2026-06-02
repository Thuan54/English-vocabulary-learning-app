from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from ml_server.models.ai_explained import WordExplainer



explain_router = APIRouter(
    prefix="/explain",
    tags=["Explaination"]
)

# Khai báo schema cho Request và Response
class ExplainRequest(BaseModel):
    word: Optional[str] = None
    text: Optional[str] = None

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
async def explain_word(request: ExplainRequest):
    """
        Endpoint nhận từ vựng hoặc đoạn text và trả về đoạn giải thích từ AI.
        - "word": dùng cho từ đơn lẻ
        - "text": dùng cho câu/đoạn văn (từ PDF Explainer)
    """
    # Ưu tiên text (câu/đoạn), fallback sang word (từ đơn)
    input_text = request.text or request.word
    if not input_text or not input_text.strip():
        raise HTTPException(status_code=400, detail="Cần cung cấp 'word' hoặc 'text'")

    try:
        result = get_explainer().explain(input_text.strip())
        return {"explanation": result}
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi giải nghĩa: {str(e)}"
        )