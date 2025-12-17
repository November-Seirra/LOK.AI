from typing import List, Optional, TYPE_CHECKING
from sqlmodel import Relationship, Field
from backend.model.mixins import UUIDMixin, TimeMixin
from backend.model.person import Person
from backend.model.user_role import UserRole

if TYPE_CHECKING:
    from backend.model.role import Role

class Users(UUIDMixin, TimeMixin, Person, table=True):
    __tablename__ = "users"
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password: str
    
    roles: List["Role"] = Relationship(back_populates="users", link_model=UserRole)
