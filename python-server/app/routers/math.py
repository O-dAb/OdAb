from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Body
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import io
import json
import uuid
from pydantic import BaseModel, Field
from enum import Enum
import logging
import base64

from app.services.image_service import ImageService
from app.services.math_solver import MathSolver

logger = logging.getLogger(__name__)

# 서비스 인스턴스 생성
image_service = ImageService()
math_solver = MathSolver()

# 문제 유형 Enum
class ProblemType(str, Enum):
    ARITHMETIC = "arithmetic"
    ALGEBRA = "algebra"
    GEOMETRY = "geometry"
    CALCULUS = "calculus"
    STATISTICS = "statistics"
    OTHER = "other"

# 요청 모델
class TextCorrectionRequest(BaseModel):
    detected_text: str
    corrected_text: str
    problem_id: Optional[str] = None
    problem_type: Optional[ProblemType] = ProblemType.OTHER

# 피드백 요청 모델
class FeedbackRequest(BaseModel):
    problem_id: str
    rating: float = Field(..., ge=1.0, le=5.0, description="1.0에서 5.0 사이의 평점")
    feedback_text: Optional[str] = None

# 솔루션 모델
class SolutionStep(BaseModel):
    content: str

class MathSolution(BaseModel):
    problem_id: str
    problem_text: str
    solution_steps: List[str]
    final_answer: str
    confidence: float
    related_concepts: Optional[List[str]] = None
    elapsed_time: Optional[float] = None
    similar_problems_found: Optional[int] = None
    detected_concepts: Optional[List[str]] = None

class NaturalFeedbackRequest(BaseModel):
    problem_id: str
    original_text: str
    current_text: str
    feedback_history: List[str]
    new_feedback: str
    image_url: Optional[str] = None

class CompactFeedbackRequest(BaseModel):
    problem_id: str
    original_text: str
    image_url: Optional[str] = None
    final_answer: str

router = APIRouter(tags=["math"])

@router.post("/upload-problem", response_model=Dict[str, Any])
async def upload_problem_image(
    file: UploadFile = File(...),
    problem_type: Optional[str] = Form(None)
):
    """수학 문제 이미지 업로드 및 텍스트 추출"""
    try:
        # 이미지 데이터 읽기
        image_data = await file.read()
        
        # 이미지 전처리
        processed_image = image_service.preprocess_image(image_data)
        
        # 이미지에서 텍스트 추출
        extraction_result = await image_service.extract_text_from_image(processed_image)
        
        # 임시 문제 ID 생성
        problem_id = str(uuid.uuid4())
        
        return {
            "problem_id": problem_id,
            "detected_text": extraction_result["text"],
            "latex": extraction_result["latex"],
            "problem_type": problem_type or "geometry"
        }
        
    except Exception as e:
        logger.error(f"이미지 처리 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"이미지 처리 오류: {str(e)}")

@router.post("/solve-problem", response_model=Dict[str, Any])
async def solve_math_problem(request: TextCorrectionRequest):
    """수정된 텍스트로 수학 문제 해결"""
    try:
        # 시작 로깅
        logger.info(f"문제 해결 요청 - 문제 유형: {request.problem_type}, 텍스트 길이: {len(request.corrected_text)}")
        
        # 수학 문제 해결
        solution = await math_solver.solve_problem(
            problem_text=request.corrected_text,
            problem_type=request.problem_type
        )
        
        # 성공 로깅
        logger.info(f"문제 해결 완료 - 문제 ID: {solution.get('problem_id')}, 단계 수: {len(solution.get('solution_steps', []))}")
        
        return solution
        
    except Exception as e:
        logger.error(f"문제 해결 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"문제 해결 오류: {str(e)}")

@router.post("/feedback", response_model=Dict[str, Any])
async def provide_solution_feedback(request: FeedbackRequest):
    """해결책에 대한 사용자 피드백 제공"""
    try:
        # 피드백 처리
        success = await math_solver.provide_solution_feedback(
            problem_id=request.problem_id,
            rating=request.rating,
            feedback_text=request.feedback_text
        )
        
        if success:
            logger.info(f"피드백 처리 성공 - 문제 ID: {request.problem_id}, 평점: {request.rating}")
            return {"status": "success", "message": "피드백이 성공적으로 처리되었습니다."}
        else:
            logger.warning(f"피드백 처리 실패 - 문제 ID: {request.problem_id}")
            return {"status": "error", "message": "피드백 처리 중 오류가 발생했습니다."}
        
    except Exception as e:
        logger.error(f"피드백 처리 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"피드백 처리 오류: {str(e)}")

@router.get("/similar-problems", response_model=List[Dict[str, Any]])
async def find_similar_problems(
    query: str, 
    problem_type: Optional[str] = None,
    top_k: int = 5
):
    """유사한 수학 문제 검색"""
    try:
        logger.info(f"유사 문제 검색 요청 - 쿼리: {query[:50]}..., 유형: {problem_type}")
        
        # 다중 전략 검색 사용
        similar_problems = math_solver.vector_service.multi_strategy_search(
            problem_text=query,
            top_k=top_k,
            problem_type=problem_type
        )
        
        logger.info(f"유사 문제 검색 완료 - {len(similar_problems)}개 결과 반환")
        return similar_problems
        
    except Exception as e:
        logger.error(f"유사 문제 검색 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"유사 문제 검색 오류: {str(e)}")

@router.get("/problem/{problem_id}", response_model=Dict[str, Any])
async def get_problem_details(problem_id: str):
    """문제 상세 정보 조회"""
    try:
        points = math_solver.vector_service.client.retrieve(
            collection_name=math_solver.vector_service.collection_name,
            ids=[problem_id],
            with_payload=True
        )
        
        if not points or len(points) == 0:
            raise HTTPException(status_code=404, detail=f"ID가 {problem_id}인 문제를 찾을 수 없습니다.")
        
        # 페이로드 변환 및 반환
        problem_data = points[0].payload
        problem_data["id"] = problem_id
        problem_data["embedding"] = None  # 임베딩은 제외
        
        return problem_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"문제 상세 조회 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"문제 상세 조회 오류: {str(e)}")

@router.post("/natural-feedback", response_model=Dict[str, Any])
async def natural_feedback(request: NaturalFeedbackRequest):
    """자연어 피드백 기반 문제 텍스트 수정"""
    try:
        result = await math_solver.feedback_based_text_correction(
            problem_id=request.problem_id,
            original_text=request.original_text,
            current_text=request.current_text,
            feedback_history=request.feedback_history,
            new_feedback=request.new_feedback,
            image_url=request.image_url
        )
        return {"problem_text": result}
    except Exception as e:
        logger.error(f"자연어 피드백 처리 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"피드백을 전송하는 중 오류가 발생했습니다.")

@router.post("/compact-feedback")
async def compact_feedback(request: CompactFeedbackRequest):
    try:
        success = math_solver.vector_service.store_compact_solution(
            problem_id=request.problem_id,
            original_text=request.original_text,
            image_url=request.image_url,
            final_answer=request.final_answer
        )
        if not success:
            raise Exception("Qdrant 저장 실패")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"compact-feedback 저장 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"compact-feedback 저장 오류: {str(e)}") 