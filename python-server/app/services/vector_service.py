from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue, Range, PayloadSchemaType
import os
import logging
import uuid
import json
import numpy as np
from typing import List, Dict, Any, Optional, Tuple, Union

logger = logging.getLogger(__name__)

class VectorService:
    def __init__(self):
        self.model_name = "BAAI/bge-large-en-v1.5"
        logger.info(f"임베딩 모델 {self.model_name} 로드 중...")
        self.model = SentenceTransformer(self.model_name)
        logger.info("임베딩 모델 로드 완료")
        
        # Qdrant 클라이언트 설정
        qdrant_path = os.path.join(os.getcwd(), "qdrant_data")
        logger.info(f"Qdrant 저장소 경로: {qdrant_path}")
        self.client = QdrantClient(path=qdrant_path)
        logger.info("Qdrant 연결 완료")
        
        # 수학 문제 컬렉션
        self.collection_name = "math_problems"
        
        # 컬렉션 존재 확인 및 생성
        self._ensure_collection_exists()
        
        # 수학 관련 개념 및 키워드 로드
        self.math_concepts = self._load_math_concepts()
    
    def _load_math_concepts(self) -> Dict[str, List[str]]:
        """수학 관련 개념과 키워드 로드"""
        # 실제 구현에서는 파일이나 DB에서 로드 (여기서는 예시 데이터만 포함)
        concepts = {
            "geometry": [
                "삼각형", "사각형", "원", "타원", "다각형", "피타고라스", "삼각비", "사인법칙", "코사인법칙", 
                "내접원", "외접원", "닮음", "합동", "평행", "수직", "좌표평면", "벡터"
            ],
            "algebra": [
                "방정식", "부등식", "함수", "그래프", "인수분해", "근의 공식", "이차방정식", "다항식", 
                "유리식", "무리식", "로그", "지수", "행렬", "집합", "경우의 수", "확률"
            ],
            "calculus": [
                "미분", "적분", "극한", "연속", "도함수", "접선", "최대값", "최소값", "부정적분", "정적분", 
                "미분방정식", "수열", "급수", "수렴", "발산"
            ],
            "statistics": [
                "평균", "중앙값", "최빈값", "표준편차", "분산", "상관관계", "회귀분석", "확률분포", 
                "정규분포", "이항분포", "표본", "가설검정"
            ]
        }
        return concepts
    
    def _ensure_collection_exists(self):
        """컬렉션 존재 확인 및 생성"""
        try:
            collections = self.client.get_collections()
            collection_names = [collection.name for collection in collections.collections]
            
            if self.collection_name not in collection_names:
                logger.info(f"컬렉션 {self.collection_name} 생성 중...")
                
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.model.get_sentence_embedding_dimension(),
                        distance=Distance.COSINE
                    )
                )
                
                # 샘플 데이터 추가 (초기 테스트용)
                self._add_sample_problems()
                
                logger.info(f"컬렉션 {self.collection_name} 생성 완료")
        except Exception as e:
            logger.error(f"컬렉션 생성 오류: {str(e)}")
            raise
    
    def _add_sample_problems(self):
        """샘플 수학 문제 추가"""
        sample_problems = [
            {
                "problem_text": "직각삼각형의 두 변의 길이가 3과 4일 때, 빗변의 길이는?",
                "solution_text": "피타고라스 정리에 의해 a² + b² = c²이므로, 3² + 4² = c²에서 9 + 16 = c², c² = 25, c = 5",
                "problem_type": "geometry",
                "difficulty": 1.0,
                "concepts": ["피타고라스 정리", "직각삼각형"],
                "grade_level": 9,
                "source": "sample"
            },
            {
                "problem_text": "이차방정식 x² - 5x + 6 = 0의 두 근은?",
                "solution_text": "인수분해: x² - 5x + 6 = (x - 2)(x - 3) = 0, 따라서 x = 2 또는 x = 3",
                "problem_type": "algebra",
                "difficulty": 1.0,
                "concepts": ["이차방정식", "인수분해"],
                "grade_level": 9,
                "source": "sample"
            },
            {
                "problem_text": "두 원 O₁, O₂의 반지름이 각각 5cm, 3cm이고, 두 원의 중심 사이의 거리가 10cm일 때, 두 원의 공통 외접선의 개수는?",
                "solution_text": "두 원의 공통 외접선의 개수는 두 원의 중심 사이의 거리가 두 반지름의 합과 같으면 1개, 크면 2개입니다. 여기서는 10 > 5 + 3 = 8이므로 두 원의 공통 외접선은 2개입니다.",
                "problem_type": "geometry",
                "difficulty": 2.0,
                "concepts": ["원", "접선"],
                "grade_level": 10,
                "source": "sample"
            }
        ]
        
        for problem in sample_problems:
            self.store_problem_solution(
                problem_text=problem["problem_text"],
                solution_text=problem["solution_text"],
                problem_type=problem["problem_type"],
                difficulty=problem["difficulty"],
                concepts=problem["concepts"],
                grade_level=problem["grade_level"],
                source=problem["source"]
            )
    
    def create_enhanced_embedding(self, problem_text: str, problem_type: Optional[str] = None, concepts: Optional[List[str]] = None) -> np.ndarray:
        """풍부한 컨텍스트를 포함한 임베딩 생성"""
        # 메타데이터를 포함한 풍부한 텍스트 생성
        enriched_text = f"문제 유형: {problem_type or '미분류'}\n"
        
        if concepts and len(concepts) > 0:
            enriched_text += f"관련 개념: {', '.join(concepts)}\n"
        
        enriched_text += f"문제: {problem_text}"
        
        # 임베딩 생성
        return self.model.encode(enriched_text, normalize_embeddings=True)
    
    def detect_problem_concepts(self, problem_text: str) -> List[str]:
        """문제 텍스트에서 수학 개념 키워드 감지"""
        detected_concepts = []
        
        # 각 카테고리의 개념에 대해 검사
        for category, concepts in self.math_concepts.items():
            for concept in concepts:
                if concept in problem_text:
                    detected_concepts.append(concept)
        
        return detected_concepts
    
    def store_problem_solution(
        self, 
        problem_text: str, 
        solution_text: str, 
        problem_type: str, 
        difficulty: float = 1.0,
        concepts: Optional[List[str]] = None,
        grade_level: int = 9,
        source: str = "user",
        rating: float = 3.0
    ) -> str:
        """문제와 해결책을 벡터 DB에 저장"""
        try:
            # 개념이 제공되지 않은 경우 자동 감지
            if not concepts:
                concepts = self.detect_problem_concepts(problem_text)
            
            # 현재 시간 (타임스탬프)
            import time
            current_time = int(time.time())
            
            # 임베딩 생성
            embedding = self.create_enhanced_embedding(problem_text, problem_type, concepts)
            
            # 고유 ID 생성
            point_id = str(uuid.uuid4())
            
            # 포인트 생성 및 저장
            point = PointStruct(
                id=point_id,
                vector=embedding.tolist(),
                payload={
                    "problem_text": problem_text,
                    "solution_text": solution_text,
                    "problem_type": problem_type,
                    "difficulty": difficulty,
                    "concepts": concepts,
                    "grade_level": grade_level,
                    "source": source,
                    "created_at": current_time,
                    "rating": rating
                }
            )
            
            # 벡터 DB에 저장
            self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )
            
            logger.info(f"문제와 해결책이 ID {point_id}로 저장되었습니다.")
            return point_id
            
        except Exception as e:
            logger.error(f"문제 저장 오류: {str(e)}")
            raise
    
    def update_solution_rating(self, problem_id: str, rating: float) -> bool:
        """문제 해결책의 평점 업데이트"""
        try:
            # 기존 포인트 가져오기
            points = self.client.retrieve(
                collection_name=self.collection_name,
                ids=[problem_id]
            )
            
            if not points or len(points) == 0:
                logger.error(f"ID가 {problem_id}인 문제를 찾을 수 없습니다.")
                return False
            
            # 기존 payload 가져오기
            payload = points[0].payload
            
            # 평점 업데이트
            payload["rating"] = rating
            
            # 업데이트된 payload로 포인트 업데이트
            self.client.set_payload(
                collection_name=self.collection_name,
                payload=payload,
                points=[problem_id]
            )
            
            logger.info(f"문제 ID {problem_id}의 평점이 {rating}로 업데이트되었습니다.")
            return True
            
        except Exception as e:
            logger.error(f"평점 업데이트 오류: {str(e)}")
            return False
    
    def multi_strategy_search(
        self, 
        problem_text: str, 
        top_k: int = 5, 
        problem_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """다중 전략 RAG 검색 (벡터 유사도 + 메타데이터 필터링)"""
        try:
            # 1. 개념 감지
            detected_concepts = self.detect_problem_concepts(problem_text)
            logger.info(f"감지된 개념: {detected_concepts}")
            
            # 2. 임베딩 생성
            query_vector = self.create_enhanced_embedding(problem_text, problem_type, detected_concepts).tolist()
            
            # 3. 검색 실행 - 필터 없이 단순 벡터 검색
            vector_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k * 2,  # 더 많은 결과를 가져와서 필터링
                with_payload=True
            )
            logger.info(f"Qdrant 전체 문제 개수(검색 결과): {len(vector_results)}")
            
            # 4. 유사도 임계값 적용 및 신뢰도 레벨 추가
            SIMILARITY_THRESHOLD = 0.85  # 85% 이상만 고려
            MAX_HIGH_SIMILARITY_RESULTS = 3  # 유사도가 높은 문제는 최대 3개까지만 고려
            combined_results = []
            
            for result in vector_results:
                if float(result.score) >= SIMILARITY_THRESHOLD:
                    # 유사도에 따른 신뢰도 레벨 추가
                    confidence_level = ""
                    if float(result.score) >= 0.95:
                        confidence_level = "매우 높음"
                    elif float(result.score) >= 0.85:
                        confidence_level = "높음"
                    elif float(result.score) >= 0.70:
                        confidence_level = "중간"
                    else:
                        confidence_level = "낮음"
                    
                    combined_results.append({
                        "id": result.id,
                        "score": float(result.score),
                        "problem_text": result.payload.get("problem_text", ""),
                        "solution_text": result.payload.get("solution_text", result.payload.get("final_answer", "")),
                        "problem_type": result.payload.get("problem_type", ""),
                        "difficulty": result.payload.get("difficulty", 1.0),
                        "concepts": result.payload.get("concepts", []),
                        "grade_level": result.payload.get("grade_level", 9),
                        "rating": result.payload.get("rating", 3.0),
                        "search_method": "vector",
                        "confidence_level": confidence_level  # 신뢰도 레벨 추가
                    })
            
            logger.info(f"Qdrant 유사 문제(임계값 {SIMILARITY_THRESHOLD}) 개수: {len(combined_results)}")
            
            # 5. 결과 정렬 (유사도 내림차순)
            combined_results.sort(key=lambda x: x["score"], reverse=True)
            
            # 6. 유사도가 높은 문제가 많을 경우 상위 3개까지만 반환
            high_similarity_count = len([r for r in combined_results if r["score"] >= SIMILARITY_THRESHOLD])
            
            if high_similarity_count > MAX_HIGH_SIMILARITY_RESULTS:
                logger.info(f"유사도 {SIMILARITY_THRESHOLD*100}% 이상의 문제가 {high_similarity_count}개 발견됨, 상위 {MAX_HIGH_SIMILARITY_RESULTS}개만 반환")
                return combined_results[:MAX_HIGH_SIMILARITY_RESULTS]
            else:
                # 일반적인 경우에는 요청된 top_k개 반환
                return combined_results[:top_k]
            
        except Exception as e:
            logger.error(f"다중 전략 검색 오류: {str(e)}")
            return []
    
    def find_similar_problems(self, problem_text: str, top_k: int = 5, problem_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """유사한 문제 검색 (레거시 호환성용)"""
        # 다중 전략 검색으로 대체
        return self.multi_strategy_search(problem_text, top_k, problem_type)
    
    def extract_solution_patterns(self, similar_problems: List[Dict[str, Any]]) -> str:
        """유사 문제의 해결 패턴 추출"""
        if not similar_problems or len(similar_problems) == 0:
            return ""
        
        patterns = []
        
        for idx, problem in enumerate(similar_problems, 1):
            # 가중치 계산 (유사도 점수 + 평점 기반)
            weight = problem.get("score", 0.5) * 0.6 + (problem.get("rating", 3.0) / 5.0) * 0.4
            weight_str = f"참고 가중치: {weight:.2f}"
            
            # 패턴 추가
            pattern = f"참고 문제 {idx} ({weight_str}):\n"
            pattern += f"문제: {problem['problem_text']}\n"
            pattern += f"풀이: {problem['solution_text']}\n"
            pattern += f"관련 개념: {', '.join(problem['concepts'])}\n\n"
            
            patterns.append(pattern)
        
        return "\n".join(patterns)
    
    def extract_relevant_concepts_formulas(self, detected_concepts: List[str]) -> str:
        """관련 개념 및 공식 추출 (간단 구현)"""
        if not detected_concepts or len(detected_concepts) == 0:
            return ""
        
        concept_info = {
            "피타고라스 정리": "직각삼각형에서 a² + b² = c² (c는 빗변, a와 b는 다른 두 변)",
            "삼각형": "넓이 = (밑변 × 높이) ÷ 2",
            "원": "원의 넓이 = πr², 원의 둘레 = 2πr (r은 반지름)",
            "이차방정식": "ax² + bx + c = 0의 근은 x = (-b ± √(b² - 4ac)) ÷ 2a",
            "인수분해": "x² + (a+b)x + ab = (x+a)(x+b)",
            "미분": "y = x^n 일 때, dy/dx = nx^(n-1)",
            "적분": "∫x^n dx = x^(n+1)/(n+1) + C (단, n ≠ -1)",
            "삼각비": "sin²θ + cos²θ = 1, tanθ = sinθ/cosθ",
            "직각삼각형": "직각을 낀 두 변의 길이를 a, b, 빗변의 길이를 c라 하면, a² + b² = c²",
        }
        
        formula_texts = []
        
        # 감지된 개념에 대한 공식 정보 추가
        for concept in detected_concepts:
            if concept in concept_info:
                formula_texts.append(f"{concept}: {concept_info[concept]}")
        
        return "\n".join(formula_texts)
    
    def store_compact_solution(
        self,
        problem_id: str,
        original_text: str,
        image_url: Optional[str],
        final_answer: str
    ) -> bool:
        """compact(최소 정보)로 문제와 정답을 벡터 DB에 저장"""
        try:
            # 임베딩 생성 (문제+정답)
            embedding = self.model.encode(f"문제: {original_text}\n정답: {final_answer}", normalize_embeddings=True)
            import time
            current_time = int(time.time())
            point = PointStruct(
                id=problem_id,
                vector=embedding.tolist(),
                payload={
                    "problem_text": original_text,
                    "final_answer": final_answer,
                    "image_url": image_url,
                    "created_at": current_time,
                    "source": "user_compact"
                }
            )
            self.client.upsert(
                collection_name=self.collection_name,
                points=[point]
            )
            logger.info(f"Qdrant compact 저장 성공: {problem_id}")
            return True
        except Exception as e:
            logger.error(f"compact 저장 오류: {str(e)}")
            return False 