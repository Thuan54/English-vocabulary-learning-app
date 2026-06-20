import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage


class GrammarAnalyzer:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("Thiếu biến môi trường GROQ_API_KEY. Vui lòng kiểm tra file .env")

        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=api_key,
            temperature=0.2
        )

    def _call_llm(self, system_prompt: str, human_message: str) -> str:
        """Helper gọi LLM với system prompt + human message."""
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_message)
        ]
        response = self.llm.invoke(messages)
        return response.content

    def _parse_json(self, raw: str) -> dict:
        """Trích xuất JSON từ response của LLM (có thể nằm trong code block)."""
        text = raw.strip()
        # Nếu LLM trả về trong code block ```json ... ```
        if "```json" in text:
            start = text.index("```json") + 7
            end = text.index("```", start)
            text = text[start:end].strip()
        elif "```" in text:
            start = text.index("```") + 3
            end = text.index("```", start)
            text = text[start:end].strip()
        
        return json.loads(text)

    # ─── CT Step 1: Decomposition — Grammar Analysis ────────────────────────

    def analyze_grammar(self, sentence: str) -> dict:
        system_prompt = """You are an expert English grammar analyzer for Vietnamese students studying academic English.

Your task: Analyze the given English sentence and break it down into its grammatical components.

You MUST return ONLY a valid JSON object (no extra text) with this exact structure:
{
  "mainClause": "the main independent clause",
  "dependentClauses": ["list of dependent/subordinate clauses"],
  "subject": "the main subject",
  "mainVerb": "the main verb",
  "object": "the main object (or empty string if none)",
  "posLabels": [
    {"word": "important_word", "pos": "Noun/Verb/Adjective/Adverb/Preposition/Conjunction/Pronoun/Determiner"}
  ]
}

Rules:
- Only include KEY academic/content words in posLabels (skip common words like "the", "a", "is")
- If no dependent clauses exist, use an empty array []
- If no object exists, use an empty string ""
- Keep mainClause as the full independent clause
- Be accurate with POS tagging"""

        human_msg = f"Analyze this sentence: \"{sentence}\""
        raw = self._call_llm(system_prompt, human_msg)
        return self._parse_json(raw)

    # ─── CT Step 2: Pattern Recognition — Scan Academic Patterns ─────────────

    def scan_patterns(self, text: str) -> dict:
        system_prompt = """You are an academic English pattern scanner. Your job is to find academic collocations and signal/transition words in the given text.

You MUST return ONLY a valid JSON object (no extra text) with this exact structure:
{
  "collocations": [
    {"phrase": "the exact collocation phrase", "type": "collocation", "category": "research/analysis/evidence/methodology"}
  ],
  "signalWords": [
    {"phrase": "the exact signal word/phrase", "type": "signal-word", "category": "result/contrast/addition/cause/example/conclusion/sequence"}
  ]
}

Academic Collocations to look for (examples):
- Research: "conduct research", "carry out a study", "collect data", "gather evidence"
- Analysis: "perform an analysis", "draw conclusions", "examine the relationship"
- Evidence: "empirical evidence", "significant impact", "substantial increase"
- Methodology: "random sample", "control group", "statistical analysis"

Signal Words to look for:
- Result/Effect: "consequently", "therefore", "as a result", "thus", "hence"
- Contrast: "however", "on the other hand", "nevertheless", "in contrast", "whereas"
- Addition: "furthermore", "moreover", "in addition", "additionally"
- Cause: "because", "due to", "owing to", "since"
- Example: "for instance", "for example", "such as", "namely"
- Conclusion: "in conclusion", "to summarize", "overall", "in summary"
- Sequence: "firstly", "secondly", "finally", "subsequently"

Rules:
- Only find phrases that ACTUALLY EXIST in the text (exact match)
- Return empty arrays if nothing is found
- Be selective — only include clear academic patterns, not common everyday usage"""

        human_msg = f"Scan this text for academic patterns:\n\n{text}"
        raw = self._call_llm(system_prompt, human_msg)
        return self._parse_json(raw)

    # ─── CT Step 3: Abstraction — Smart Flashcard ────────────────────────────

    def smart_flashcard(self, word: str, surrounding_text: str) -> dict:
        system_prompt = """You are a vocabulary extraction expert for Vietnamese students reading English academic papers.

Your task: Create a minimal, effective flashcard for the given word based on its context in the academic text.

You MUST return ONLY a valid JSON object (no extra text) with this exact structure:
{
  "word": "the target word",
  "pronunciation": "/IPA pronunciation/",
  "partOfSpeech": "Noun/Verb/Adjective/Adverb/etc.",
  "definition": "Nghĩa tiếng Việt ngắn gọn, chính xác theo ngữ cảnh học thuật",
  "contextSentence": "The original sentence from the text containing the word",
  "minimalContext": "A minimal fill-in-the-blank pattern like: provides ___ evidence for..."
}

Rules:
- definition MUST be in Vietnamese
- contextSentence should be the actual sentence from the provided text
- minimalContext should replace the target word with ___ and keep only essential surrounding words
- pronunciation must be valid IPA
- partOfSpeech should match the word's usage IN THIS SPECIFIC CONTEXT"""

        human_msg = f"Create a flashcard for the word \"{word}\" found in this text:\n\n{surrounding_text}"
        raw = self._call_llm(system_prompt, human_msg)
        return self._parse_json(raw)

    # ─── CT Step 4: Algorithm Design — Paraphrase Workflow ───────────────────

    def paraphrase(self, sentence: str) -> list:
        system_prompt = """You are an academic writing coach helping Vietnamese students learn to paraphrase properly to avoid plagiarism.

Your task: Guide the student through a 3-step paraphrasing algorithm for the given sentence.

You MUST return ONLY a valid JSON array (no extra text) with exactly 3 objects:
[
  {
    "step": 1,
    "title": "Xác định luận điểm cốt lõi",
    "content": "The core idea extracted from the original sentence",
    "explanation": "Vietnamese explanation of what was kept and what was removed"
  },
  {
    "step": 2,
    "title": "Tái cấu trúc ngữ pháp",
    "content": "The restructured sentence with different grammar",
    "explanation": "Vietnamese explanation of the grammatical transformation used"
  },
  {
    "step": 3,
    "title": "Tinh chỉnh từ vựng",
    "content": "The final paraphrased sentence with academic synonyms",
    "explanation": "Vietnamese explanation listing each word replacement"
  }
]

Rules for each step:
- Step 1: Strip away unnecessary details, keep only the essential claim/finding
- Step 2: Change sentence structure (active↔passive, clause reordering, nominalization, etc.)
- Step 3: Replace key content words with academic synonyms while keeping the new structure
- Each 'content' field should show the ENGLISH result of that step
- Each 'explanation' field should be in VIETNAMESE, teaching the student WHY this change works
- The final result in step 3 must be a legitimate, plagiarism-free paraphrase"""

        human_msg = f"Guide me through paraphrasing this sentence:\n\n\"{sentence}\""
        raw = self._call_llm(system_prompt, human_msg)
        return self._parse_json(raw)
