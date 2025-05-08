from fastapi import FastAPI

app = FastAPI()

@app.get("/api/python/health")
def health_check():
    return {"status": "UP"}