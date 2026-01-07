from fastapi import APIRouter

api_router = APIRouter()
from . import auth, documents

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
