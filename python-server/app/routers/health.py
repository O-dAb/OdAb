# app/routers/health.py
from fastapi import APIRouter
from app.models.base import HealthResponse

router = APIRouter(prefix="/api/python", tags=["health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "UP"}