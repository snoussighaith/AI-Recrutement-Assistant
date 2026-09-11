from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import des routers
from routers import cv, offres, stats

# Import DB et modèles pour créer les tables au démarrage
from database import engine
import models  # noqa: F401


app = FastAPI(title="AI Recrutement API", version="0.1.0")

# Crée les tables si elles n'existent pas (utile en dev / docker-compose)
from database import Base
Base.metadata.create_all(bind=engine)

app.include_router(stats.router, prefix="/api/stats", tags=["Stats"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv.router, prefix="/api/cv", tags=["CV"])
app.include_router(offres.router, prefix="/api/offres", tags=["Offres"])


@app.get("/")
def root():
    return {"status": "ok", "message": "AI Recrutement API"}