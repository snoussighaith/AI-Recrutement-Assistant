from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import cv, offres

app = FastAPI(title="AI Recrutement API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv.router, prefix="/api/cv", tags=["CV"])
app.include_router(offres.router, prefix="/api/offres", tags=["Offres"])

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Recrutement API"}