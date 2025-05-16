# build_index.py

import pymysql
import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
import os

# 환경 변수에서 DB 접속 정보 가져오기
db_host = 'localhost'  # Docker 네트워크 내에서 사용되는 서비스 이름
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
question_rows = cursor.fetchall()  # [(1, '함수 f(x) = x^2 + 2x + 1의 최솟값을 구하시오.'), ...]

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