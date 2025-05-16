from fastapi import FastAPI

# 추가
from pydantic import BaseModel
import faiss
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import pymysql
import os
from app.routers import health

# 인덱스 생성 함수
def build_index():
    print("인덱스 생성을 시작합니다...")
    
    # 환경 변수에서 DB 접속 정보 가져오기
    db_host = 'my-db'  # Docker 네트워크 내에서 사용되는 서비스 이름
    db_user = os.environ.get('MYSQL_USER', 'root')
    db_password = os.environ.get('MYSQL_PASSWORD', 'root')
    db_name = os.environ.get('MYSQL_DATABASE', 'ddalggak')
    
    # DB 연결
    conn = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        db=db_name,
        charset='utf8'
    )
    cursor = conn.cursor()
    
    # 문제 임베딩
    cursor.execute("SELECT question_id, question_text FROM rag_question")
    question_rows = cursor.fetchall()
    
    # 임베딩 모델 로딩
    model = SentenceTransformer('BAAI/bge-m3')
    
    # 문제 임베딩
    question_ids = []
    question_vectors = []
    
    for question_id, question_text in question_rows:
        vec = model.encode(question_text)
        question_vectors.append(vec)
        question_ids.append(question_id)
    
    # 문제 벡터 numpy 배열로 변환
    question_vectors_np = np.array(question_vectors).astype('float32')
    
    # 문제 FAISS 인덱스 생성
    question_index = faiss.IndexFlatL2(question_vectors_np.shape[1])
    question_index.add(question_vectors_np)
    
    # 문제 인덱스 및 ID 매핑 저장
    faiss.write_index(question_index, "question.index")
    
    with open("question_id_map.pkl", "wb") as f:
        pickle.dump(question_ids, f)
    
    print(f"✅ {len(question_ids)}개의 문제를 인덱싱했습니다.")
    cursor.close()
    conn.close()

# 애플리케이션 시작 시 인덱스 생성
build_index()

# 모델, 인덱스, ID 매핑 로딩
model = SentenceTransformer('BAAI/bge-m3')

# 문제 인덱스 로딩
question_index = faiss.read_index("question.index")
with open("question_id_map.pkl", "rb") as f:
    question_ids = pickle.load(f)
# 추가끝

app = FastAPI()

# 라우터 등록
app.include_router(health.router)
# 추가
# 요청 형식 정의
class Query(BaseModel):
    question: str

# 응답 형식 - 문제
class QuestionResponse(BaseModel):
    question_id: Optional[int] = None
    similarity: Optional[float] = None
# 추가끝

# 기본 경로
@app.get("/")
def read_root():
    return {"message": "Welcome to Python API"}

# 추가
# 검색 API 엔드포인트
@app.post("/search", response_model=QuestionResponse)
def search_questions(query: Query):
    vec = model.encode([query.question]).astype("float32")
    D, I = question_index.search(vec, k=1)  # 가장 유사한 문제 1개만 검색
    
    # L2 거리를 유사도 점수로 변환 (거리가 작을수록 유사도가 높음)
    threshold = 0.2
    
    if len(I[0]) > 0:
        similarity = 1 / (1 + D[0][0])
        if similarity >= threshold:
            question_id = question_ids[I[0][0]]
            return {"question_id": question_id, "similarity": float(similarity)}
    
    return {"question_id": None, "similarity": None}
# 추가끝