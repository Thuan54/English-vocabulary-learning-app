from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

from models.grammar_model import GrammarAnalyzer

grammar_router = APIRouter(
    prefix="/grammar",
    tags=["Grammar & CT Features"]
)

# ─── Request / Response Schemas ─────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    sentence: str

class PosLabel(BaseModel):
    word: str
    pos: str

class AnalysisResult(BaseModel):
    mainClause: str
    dependentClauses: List[str]
    subject: str
    mainVerb: str
    object: str
    posLabels: List[PosLabel]

class AnalyzeResponse(BaseModel):
    analysis: AnalysisResult


class ScanPatternsRequest(BaseModel):
    text: str

class PatternMatch(BaseModel):
    phrase: str
    type: str  # "collocation" or "signal-word"
    category: Optional[str] = None  # e.g. "result", "contrast", "addition"

class ScanPatternsResponse(BaseModel):
    collocations: List[PatternMatch]
    signalWords: List[PatternMatch]


class SmartFlashcardRequest(BaseModel):
    word: str
    surroundingText: str

class FlashcardData(BaseModel):
    word: str
    pronunciation: str
    partOfSpeech: str
    definition: str
    contextSentence: str
    minimalContext: str

class SmartFlashcardResponse(BaseModel):
    flashcard: FlashcardData


class ParaphraseRequest(BaseModel):
    sentence: str

class ParaphraseStep(BaseModel):
    step: int
    title: str
    content: str
    explanation: str

class ParaphraseResponse(BaseModel):
    steps: List[ParaphraseStep]


# ─── Lazy init ──────────────────────────────────────────────────────────────

_analyzer: GrammarAnalyzer | None = None

def get_analyzer() -> GrammarAnalyzer:
    global _analyzer
    if _analyzer is None:
        _analyzer = GrammarAnalyzer()
    return _analyzer


# ─── Endpoints ──────────────────────────────────────────────────────────────

@grammar_router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_grammar(request: AnalyzeRequest):
    """
    CT Step 1 — Decomposition: Phân tích cấu trúc ngữ pháp của câu.
    Tách mệnh đề chính/phụ, xác định S-V-O, gắn nhãn từ loại.
    """
    if not request.sentence or not request.sentence.strip():
        raise HTTPException(status_code=400, detail="Cần cung cấp 'sentence'")
    
    try:
        result = get_analyzer().analyze_grammar(request.sentence.strip())
        return {"analysis": result}
    except Exception as e:
        print(f"[Grammar Analyze Error] {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi phân tích ngữ pháp: {str(e)}")


@grammar_router.post("/scan-patterns", response_model=ScanPatternsResponse)
async def scan_patterns(request: ScanPatternsRequest):
    """
    CT Step 2 — Pattern Recognition: Quét cụm từ học thuật và từ nối.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Cần cung cấp 'text'")
    
    try:
        result = get_analyzer().scan_patterns(request.text.strip())
        return result
    except Exception as e:
        print(f"[Scan Patterns Error] {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi quét cụm từ: {str(e)}")


@grammar_router.post("/smart-flashcard", response_model=SmartFlashcardResponse)
async def smart_flashcard(request: SmartFlashcardRequest):
    """
    CT Step 3 — Abstraction: Trích xuất flashcard thông minh kèm ngữ cảnh tối giản.
    """
    if not request.word or not request.word.strip():
        raise HTTPException(status_code=400, detail="Cần cung cấp 'word'")
    
    try:
        result = get_analyzer().smart_flashcard(request.word.strip(), request.surroundingText.strip())
        return {"flashcard": result}
    except Exception as e:
        print(f"[Smart Flashcard Error] {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi tạo flashcard: {str(e)}")


@grammar_router.post("/paraphrase", response_model=ParaphraseResponse)
async def paraphrase_guide(request: ParaphraseRequest):
    """
    CT Step 4 — Algorithm Design: Hướng dẫn paraphrase theo 3 bước.
    """
    if not request.sentence or not request.sentence.strip():
        raise HTTPException(status_code=400, detail="Cần cung cấp 'sentence'")
    
    try:
        result = get_analyzer().paraphrase(request.sentence.strip())
        return {"steps": result}
    except Exception as e:
        print(f"[Paraphrase Error] {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi paraphrase: {str(e)}")
