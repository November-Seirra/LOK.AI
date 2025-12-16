import uvicorn
from fastapi import FastAPI, APIRouter

app = FastAPI()

router = APIRouter()

@router.get("/")
async def home():
    return {"message": "Hello World"}


@router.get("/")
async def home():
    return {"message": "Hello World"}

app.include_router(router)


def start():
    """""Launched with 'poetry run start' at root level"""
    uvicorn.run("backend.main:app", host="localhost", port=8888, reload=True)