from fastapi import FastAPI
from app.core.config import settings
from app.api.v1 import api

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api.api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to LokAI API"}
