import uuid
import asyncio
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()

# --- MOCK DATA STRUCTURES ---

class QuizGenerateRequest(BaseModel):
    document_id: uuid.UUID

class QuestionResponse(BaseModel):
    id: int
    text: str
    type: str # 'multiple_choice' or 'true_false'
    options: List[str]
    correct_index: int
    explanation: str

class QuizResponse(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    title: str
    questions: List[QuestionResponse]
    status: str # 'Generating' | 'Ready' | 'Failed'

# In-memory storage for our mock quizzes
# Format: { quiz_id: QuizResponse }
MOCK_QUIZZES = {}

# --- API ENDPOINTS ---

@router.post("/generate", response_model=dict)
async def generate_quiz(request: QuizGenerateRequest) -> Any:
    """
    Simulate generating a quiz from a document.
    Returns (immediately) with a 'Generating' status and a new quiz ID.
    """
    # Create a new fake quiz ID
    new_quiz_id = uuid.uuid4()
    
    # Store a "Ready" quiz in our mock DB
    # We simulate that it takes 0 seconds to generate for this mock, 
    # but the UI will show a loader for effect if needed.
    
    mock_questions = [
        {
            "id": 1,
            "text": "What is the primary function of the mitochondria?",
            "type": "multiple_choice",
            "options": ["Energy production", "Protein synthesis", "Waste disposal", "Cell division"],
            "correct_index": 0,
            "explanation": "Mitochondria are known as the powerhouse of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
        },
        {
            "id": 2,
            "text": "DNA analysis is NOT used in the process described in the document.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_index": 1,
            "explanation": "The document explicitly mentions that DNA analysis is a key component of the verification process."
        },
        {
            "id": 3,
            "text": "Which year was the original protocol established?",
            "type": "multiple_choice",
            "options": ["1995", "2001", "2010", "2023"],
            "correct_index": 1,
            "explanation": "Section 2.1 states that the original protocol was established in 2001 following the initial study."
        }
    ]
    
    mock_quiz = {
        "id": new_quiz_id,
        "document_id": request.document_id,
        "title": "Generated Quiz",
        "questions": mock_questions,
        "status": "Ready"
    }
    
    MOCK_QUIZZES[new_quiz_id] = mock_quiz
    
    # We'll simulate a slight delay just for the UI to feel "real"
    await asyncio.sleep(2)
    
    return {"quiz_id": new_quiz_id, "status": "Ready"}

@router.get("/", response_model=List[QuizResponse])
async def list_quizzes() -> Any:
    """
    List all available quizzes.
    For mock purposes, returns a static list of sample quizzes.
    """
    # Static mock data since we don't have persistence yet
    mock_list = [
        {
            "id": uuid.uuid4(),
            "document_id": uuid.uuid4(),
            "title": "Indian Constitution: Fundamental Rights",
            "questions": [], # Omitted for brevity in list view
            "status": "Completed"
        },
        {
            "id": uuid.uuid4(),
            "document_id": uuid.uuid4(),
            "title": "Modern History: 1857 Revolt",
            "questions": [],
            "status": "In Progress"
        },
         {
            "id": uuid.uuid4(),
            "document_id": uuid.uuid4(),
            "title": "Geography: River Systems of India",
            "questions": [],
            "status": "New"
        }
    ]
    return mock_list

@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(quiz_id: uuid.UUID) -> Any:
    """
    Get a specific quiz by ID.
    """
    if quiz_id in MOCK_QUIZZES:
        return MOCK_QUIZZES[quiz_id]
    
    # Fallback if we restart server and lose memory, just return a generic one for dev flow
    return {
        "id": quiz_id,
        "document_id": uuid.uuid4(),
        "title": "Mock Quiz (Server Restarted)",
        "questions": [
             {
                "id": 1,
                "text": "The server was restarted, so this is a fallback question.",
                "type": "multiple_choice",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_index": 0,
                "explanation": "We lost the in-memory data."
            }
        ],
        "status": "Ready"
    }
