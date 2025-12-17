from typing import List, Optional, TYPE_CHECKING
from sqlmodel import Relationship, SQLModel
from backend.model.mixins import UUIDMixin, TimeMixin
from backend.model.user_role import UserRole

if TYPE_CHECKING:
    from backend.model.users import Users

class Role(UUIDMixin, TimeMixin, table=True):
    __tablename__ = "roles"
    role_name: str
    description: Optional[str] = None
    
    users: List["Users"] = Relationship(back_populates="roles", link_model=UserRole)
