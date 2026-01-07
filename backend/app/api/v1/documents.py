import os
import shutil
import uuid
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.core.database import get_db
from app.api.deps import get_current_user

router = APIRouter()

# The folder where we will store uploaded files
UPLOAD_DIR = "uploads"

# --- HELPER FUNCTIONS ---

# This function ensures the uploads folder exists
def ensure_upload_dir():
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

# --- API ENDPOINTS ---

@router.post("/upload", response_model=schemas.DocumentResponse)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Handle file upload and save info to database
    """
    ensure_upload_dir()
    
    # Check if a file was actually sent
    if not file:
        raise HTTPException(status_code=400, detail="No file sent")

    # Generate a unique filename to avoid overwiriting existing files
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    new_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    # Save the file to our local folder
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # Get file size
    file_size = os.path.getsize(file_path)

    # Create a new record in our database
    new_doc = models.Document(
        id=uuid.UUID(file_id),
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_type=file_extension.replace(".", ""),
        size=file_size,
        status="Processing" # Initial status
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc

@router.get("/", response_model=List[schemas.DocumentResponse])
def list_documents(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Get all documents for the logged-in user
    """
    docs = db.query(models.Document).filter(models.Document.user_id == current_user.id).all()
    return docs

@router.delete("/{document_id}")
def delete_document(
    document_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """
    Delete a document from DB and the actual file from server
    """
    # Find the document and make sure it belongs to the current user
    doc = db.query(models.Document).filter(
        models.Document.id == document_id,
        models.Document.user_id == current_user.id
    ).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Try to delete the physical file
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception as e:
            # We log the error but continue to delete the DB record
            print(f"Error deleting file: {e}")

    # Delete the database record
    db.delete(doc)
    db.commit()

    return {"message": "Document deleted successfully"}
