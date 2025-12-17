from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column,String
from app.model.mixins import TimeMixin

class UsersRole(SQLModel, TimeMixin, table = True):
    __tablename__ = "users_role"

    users_id: Optional[str] = Field(default = None, foreign_key = "users.id",primary_key= True)
    role_id: Optional[str] = Field(default = None, foreign_key = "roles.id",primary_key= True)

