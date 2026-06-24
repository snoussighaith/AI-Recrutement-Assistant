import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Candidat, CV, Competence

router = APIRouter()

@router.get("/")
def get_stats(db: Session = Depends(get_db)):
    # 1. Nombre total de CVs
    total_cvs = db.query(CV).count()

    # 2. Nombre total de candidats
    total_candidats = db.query(Candidat).count()

    # 3. Compétences les plus fréquentes
    competences = db.query(Competence).all()
    skills_count = {}
    for comp in competences:
        skills_count[comp.nom] = skills_count.get(comp.nom, 0) + 1

    top_skills = sorted(skills_count.items(), key=lambda x: x[1], reverse=True)[:8]
    top_skills = [{"skill": s, "count": c} for s, c in top_skills]

    # 4. Derniers candidats ajoutés
    derniers_candidats = db.query(Candidat).order_by(Candidat.created_at.desc()).limit(5).all()
    candidats_list = []
    for c in derniers_candidats:
        skills = []
        for cv in c.cvs:
            skills += [comp.nom for comp in cv.competences]
        candidats_list.append({
            "id": c.id,
            "email": c.email,
            "skills": skills[:3],
        })

    return {
        "total_cvs": total_cvs,
        "total_candidats": total_candidats,
        "total_offres": 0,
        "top_skills": top_skills,
        "derniers_candidats": candidats_list,
    }