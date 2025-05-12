from fastapi import APIRouter, HTTPException, Depends, Body
from typing import Optional, List
from pydantic import BaseModel
from app.services.claude_service import ClaudeService
import logging # Import logging

logger = logging.getLogger(__name__) # Initialize logger

class ChatRequest(BaseModel):
    message: str
    image: Optional[str] = None

# Define request model for sequential thinking
class SequentialThinkingRequest(BaseModel):
    initial_analysis_response: str
    original_query: str
    image_data: Optional[str] = None # Pass image if relevant

# Define response model for sequential thinking
class ThoughtDetail(BaseModel):
    thought: str
    thoughtNumber: int
    isComplete: bool
    isRevision: Optional[bool] = None
    revisesThought: Optional[int] = None
    branchFromThought: Optional[int] = None
    branchId: Optional[str] = None
    needsMoreThoughts: Optional[bool] = None

class SequentialThinkingResponse(BaseModel):
    thoughts: List[ThoughtDetail]
    final_summary: str

router = APIRouter(tags=["chat"])
claude_service = ClaudeService()

@router.post("/chat")
async def send_message(request: ChatRequest):
    try:
        response = await claude_service.send_message(request.message, request.image)
        return response
    except Exception as e:
        logger.error(f"Error in /chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sequential-thinking", response_model=SequentialThinkingResponse)
async def process_sequential_thinking(request: SequentialThinkingRequest):
    try:
        logger.info(f"Received request for sequential thinking for query: {request.original_query[:50]}...")
        result = await claude_service._process_sequential_thinking(
            initial_analysis_response=request.initial_analysis_response,
            original_query=request.original_query,
            image_data=request.image_data
        )
        logger.info("Sequential thinking process completed, returning results.")
        return result
    except Exception as e:
        logger.error(f"Error in /sequential-thinking endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e)) 