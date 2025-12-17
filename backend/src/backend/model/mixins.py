from datetime import datetime
from pydantic import BaseModel,Field
from sqlalchemy import Column, DateTime
from sqlmodel import Field

class TimeMixin(BaseModel):
    """"Mxin to for datetime value of when the entiry was created and when it was last modified"""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    modified_at: datetime = Field(
        sa_column = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow,nullable = False)
    )