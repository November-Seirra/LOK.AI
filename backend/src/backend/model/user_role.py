from uuid import UUID
from sqlmodel import SQLModel, Field

class UserRole(SQLModel, table=True):
    __tablename__ = "user_role"
    user_id: UUID = Field(foreign_key="users.id", primary_key=True)
    role_id: UUID = Field(foreign_key="roles.id", primary_key=True)
