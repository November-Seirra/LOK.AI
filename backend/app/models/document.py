from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base

# This is our Document model to store file information in the database
class Document(Base):
    __tablename__ = "documents"

    # We use UUID for IDs because it's more secure than simple integers
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # We need to know which user uploaded this document
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Basic file information
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False) # Where the file is on the server
    file_type = Column(String(50), nullable=False) # e.g., pdf, docx
    size = Column(Integer, nullable=False) # Size in bytes
    
    # Status of our AI processing (Analyzed, Processing, or Error)
    status = Column(String(20), default="Processing")
    
    # Timestamps to know when it was uploaded
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True) # When AI finishes analyzing

    # This sets up a link back to the User model
    owner = relationship("User", back_populates="documents")
