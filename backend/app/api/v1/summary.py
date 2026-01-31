import uuid
import asyncio
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()

# --- MOCK DATA STRUCTURES ---

class SummaryResponse(BaseModel):
    document_id: uuid.UUID
    content: str
    status: str # 'Generating' | 'Ready' | 'Failed'

# In-memory storage for mock summaries
MOCK_SUMMARIES = {}

# --- API ENDPOINTS ---

@router.post("/{document_id}", response_model=SummaryResponse)
async def generate_summary(document_id: uuid.UUID) -> Any:
    """
    Simulate generating a summary for a document.
    """
    
    # Mock summary content
    mock_content = (
        "This document provides a comprehensive overview of the functionality and structure of mitochondria within eukaryotic cells. "
        "It details the double-membrane structure, highlighting the importance of the cristae in increasing surface area for ATP production. "
        "The text also explores the endosymbiotic theory, suggesting mitochondria originated from free-living bacteria.\n\n"
        "Furthermore, the document discusses the role of mitochondria in cell signaling, cellular differentiation, and cell death. "
        "It emphasizes the profound impact of mitochondrial dysfunction on human health, linking it to various metabolic disorders and aging processes.\n\n"
        "Finally, recent research regarding mitochondrial DNA analysis is presented. "
        "The findings suggest potential new therapeutic targets for treating mitochondrial diseases, particularly those related to oxidative stress."
    )
    
    summary = {
        "document_id": document_id,
        "content": mock_content,
        "status": "Ready"
    }
    
    MOCK_SUMMARIES[document_id] = summary
    
    # Simulate processing delay
    await asyncio.sleep(2)
    
    return summary

@router.get("/{document_id}", response_model=SummaryResponse)
async def get_summary(document_id: uuid.UUID) -> Any:
    """
    Get existing summary.
    """
    if document_id in MOCK_SUMMARIES:
        return MOCK_SUMMARIES[document_id]
        
    raise HTTPException(status_code=404, detail="Summary not found")
