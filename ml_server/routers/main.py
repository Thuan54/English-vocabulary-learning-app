from fastapi import FastAPI

from ml_server.routers.searchTopic_router import router as search_router
from ml_server.routers.ai_explained import explain_router
from ml_server.routers.embedding_router import router as embedding_router


app = FastAPI()

app.include_router(search_router)
app.include_router(explain_router)
app.include_router(embedding_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ml_server.routers.main:app", host="localhost", port=8002, reload=True)
