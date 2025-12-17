import uvicorn
from fastapi import FastAPI, APIRouter
from backend.config import db
from backend.model.users import Users
from backend.model.role import Role
from backend.model.user_role import UserRole

def init_app():
    db.init()

    app = FastAPI(
        title = "Lokai API",
        description = "Login Page",
        version = "0.0.1"
    )
    @app.on_event("startup")
    async def startup():
        await db.create_all()
    @app.on_event("shutdown")
    async def shutdown():
        await db.close()


    return app

app = init_app()   

def start():
    """""Launched with 'poetry run start' at root level"""
    uvicorn.run("backend.main:app", host="localhost", port=8888, reload=True)