from typing import Optional
from sqlalchemy import Column, String, table
from sqlmodel import SQLModel, Field, Relationship

from app.model.mixins import TimeMixin
from app.model.user_role import UsersRole

class Users(SQLModel, TimeMixin, table = True):
    __tablename__ = "users"

    id: Optional[str] = Field(default = None, primary_key = True,nullable = False)
    username: str = Field(sa_column = Column("username",String(50), unique = True))
    email: str = Field(sa_column = Column("email",String(50), unique = True))
    password: str
    
    person_id: Optional[str] = Field(default = None, foreign_key = "person.id")
    person: Optional["Person"] = Relationship(back_populates="users")

    roles: List["Role"] = Relationship(back_populates="users",link_model = "UsersRole")