from fastapi import FastAPI

app = FastAPI(title="AI Recrutement API", version="0.1.0")

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Recrutement API"}