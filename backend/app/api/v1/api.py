from fastapi import APIRouter

api_router = APIRouter()
from . import auth, documents, quizzes, summary

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
api_router.include_router(summary.router, prefix="/summary", tags=["summary"])

