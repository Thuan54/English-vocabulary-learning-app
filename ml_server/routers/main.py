from fastapi import FastAPI

from routers.searchTopic_router import router as search_router
from routers.ai_explained import explain_router
from routers.embedding_router import router as embedding_router
from routers.grammar_router import grammar_router


app = FastAPI()

app.include_router(search_router)
app.include_router(explain_router)
app.include_router(embedding_router)
app.include_router(grammar_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("routers.main:app", host="localhost", port=8003, reload=True)
