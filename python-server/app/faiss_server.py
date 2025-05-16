# faiss_server.py

from fastapi import FastAPI
from pydantic import BaseModel
import faiss
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional

# 모델, 인덱스, ID 매핑 로딩
model = SentenceTransformer('BAAI/bge-m3')

# 문제 인덱스 로딩
question_index = faiss.read_index("question.index")
with open("question_id_map.pkl", "rb") as f:
    question_ids = pickle.load(f)

app = FastAPI()

# 요청 형식 정의
class Query(BaseModel):
    question: str

# 응답 형식 - 문제
class QuestionResponse(BaseModel):
    question_id: Optional[int] = None
    similarity: Optional[float] = None

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
 