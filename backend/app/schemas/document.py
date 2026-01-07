from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

# This schema is used when we send document data back to the frontend
class DocumentResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    size: int
    status: str
    created_at: datetime
    processed_at: Optional[datetime] = None

    # This allows Pydantic to work with SQLAlchemy models
    class Config:
        from_attributes = True

# We might not need a 'DocumentCreate' schema for uploads because 
# we get data from a file upload form, but it's good practice to have it
class DocumentCreate(BaseModel):
    filename: str
    file_type: str
    size: int
