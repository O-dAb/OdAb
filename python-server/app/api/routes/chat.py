from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.claude_service import ClaudeService
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter()
claude_service = ClaudeService()

class ChatRequest(BaseModel):
    message: str
    image: Optional[str] = None

class SequentialThinkingRequest(BaseModel):
    thought: str
    nextThoughtNeeded: bool
    thoughtNumber: int
    totalThoughts: int
    isRevision: Optional[bool] = None
    revisesThought: Optional[int] = None
    branchFromThought: Optional[int] = None
    branchId: Optional[str] = None
    needsMoreThoughts: Optional[bool] = None

@router.post("/chat")
async def chat(request: ChatRequest, req: Request):
    try:
        # 요청 헤더 로깅
        logger.info("Request headers:")
        for name, value in req.headers.items():
            if name.lower() != "authorization":  # API 키는 로깅하지 않음
                logger.info(f"{name}: {value}")

        logger.info(f"Received chat request with message: {request.message[:100]}...")
        logger.info(f"Image included: {bool(request.image)}")
        
        # Claude API 키 존재 여부 확인
        api_key = os.getenv("CLAUDE_API_KEY")
        if not api_key:
            logger.error("CLAUDE_API_KEY not found in environment variables")
            raise HTTPException(status_code=500, detail="API key not configured")
            
        response = await claude_service.send_message(request.message, request.image)
        logger.info(f"Chat response received: {str(response)[:200]}...")
        return response
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.exception("Full error details:")  # 스택 트레이스 로깅
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sequential-thinking")
async def process_sequential_thinking(request: SequentialThinkingRequest):
    try:
        logger.info(f"""
        Sequential Thinking Request:
        - Thought Number: {request.thoughtNumber}
        - Total Thoughts: {request.totalThoughts}
        - Is Revision: {request.isRevision}
        - Revises Thought: {request.revisesThought}
        - Branch From: {request.branchFromThought}
        - Branch ID: {request.branchId}
        - Needs More Thoughts: {request.needsMoreThoughts}
        - Thought Content: {request.thought[:100]}...
        """)
        
        response = await claude_service.process_sequential_thinking(request.dict())
        
        logger.info(f"""
        Sequential Thinking Response:
        {str(response)[:200]}...
        """)
        
        return response
    except Exception as e:
        logger.error(f"Error in sequential thinking endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 