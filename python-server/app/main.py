from fastapi import FastAPI

# app = FastAPI()

# @app.get("/api/python/health")
# def health_check():
#     return {"status": "UP"}

from app.routers import health

app = FastAPI()

# 라우터 등록
app.include_router(health.router)

# 기본 경로
@app.get("/")
def read_root():
    return {"message": "Welcome to Python API"}