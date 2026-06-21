import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml"))

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Candidat, CV, Competence
from matcher import matcher_candidats

router = APIRouter()

class OffreInput(BaseModel):
    titre: str
    description: str
    competences: str

@router.post("/match")
def match_offre(offre: OffreInput, db: Session = Depends(get_db)):
    # 1. Récupérer tous les candidats de la BDD
    candidats_db = db.query(Candidat).all()

    # 2. Construire les dicts candidats
    candidats = []
    for c in candidats_db:
        skills = []
        experience = []
        for cv in c.cvs:
            skills += [comp.nom for comp in cv.competences]
            experience.append(cv.texte_brut or "")
        candidats.append({
            "id": c.id,
            "email": c.email,
            "skills": skills,
            "experience": experience,
            "education": [],
        })

    # 3. Construire le texte de l'offre
    offre_texte = f"{offre.titre}. {offre.description}. Compétences requises : {offre.competences}"

    # 4. Lancer le matching
    resultats = matcher_candidats(offre_texte, candidats)
    return {"offre": offre.titre, "resultats": resultats}