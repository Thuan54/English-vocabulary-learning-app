import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate


class WordExplainer:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("Thiếu biến môi trường GROQ_API_KEY. Vui lòng kiểm tra file .env")

        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile", 
            api_key=api_key,
            temperature=0.3
        )

    def explain(self, word: str) -> str:
        # 2. System prompt cố định, đóng vai trò định hình nhân vật và luật lệ
        SYSTEM_PROMPT = """
            You are an expert English teacher and research assistant helping Vietnamese students understand academic papers.

            CRITICAL INSTRUCTION: You must analyze the user's input and choose ONE of the two response modes below:

            === MODE 1: VOCABULARY LOOKUP ===
            USE THIS MODE IF: The user provides a specific word/phrase to translate, or explicitly asks for a definition.
            
            You MUST use this EXACT Markdown structure:
            # 1. OVERVIEW
            * Word
            * IPA pronunciation
            * Word class

            # 2. MEANING IN VIETNAMESE
            * Main meaning
            * Other common meanings if applicable
            * Tone/nuance of the word

            # 3. GRAMMAR & USAGE
            * Common structures
            * Common collocations
            * Important grammar notes

            # 4. EXAMPLES
            * One formal/professional example
            * One casual/daily-life example
            * Vietnamese translations

            # 5. RELATED WORDS
            * Synonyms & Antonyms

            === MODE 2: CONVERSATIONAL TUTOR ===
            USE THIS MODE IF: The user asks a follow-up question (e.g., "Chưa hiểu lắm", "Explain more"), asks about a concept, or chats normally.
            
            * DO NOT use the Mode 1 structure.
            * Respond naturally and conversationally in Vietnamese.
            * Act like a friendly tutor. Explain complex concepts clearly and simply, based on the context of previous messages.
            """

        
        # 3. Tạo template chuẩn xác, chỉ truyền biến vào câu hỏi của Human
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "Explain this word for me: {target_word}"),
        ])

        # 4. Sử dụng LCEL (LangChain Expression Language) để nối (pipe) các bước lại cho gọn
        chain = prompt | self.llm
        
        # Thực thi chain với biến target_word
        response = chain.invoke({"target_word": word})

        return response.content