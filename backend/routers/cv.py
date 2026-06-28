from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Candidat, CV, Competence
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../../ml"))
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../ml"))
from cv_parser import parse_cv
router = APIRouter()

@router.post("/upload")
async def upload_cv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés")

    # 1. Lire et parser le PDF
    content = await file.read()
    data = parse_cv(content)

    # 2. Chercher si le candidat existe déjà (par email)
    candidat = None
    if data["email"]:
        candidat = db.query(Candidat).filter(Candidat.email == data["email"]).first()

    # 3. Sinon, créer un nouveau candidat
    if not candidat:
        candidat = Candidat(
            email=data["email"],
            telephone=data["phone"],
        )
        db.add(candidat)
        db.flush()  # génère l'ID sans encore commiter

    # 4. Créer l'entrée CV liée au candidat
    cv = CV(
        candidat_id=candidat.id,
        fichier_nom=file.filename,
        texte_brut=data["raw_text"],
    )
    db.add(cv)
    db.flush()

    # 5. Sauvegarder les compétences détectées
    for skill in data["skills"]:
        competence = Competence(cv_id=cv.id, nom=skill)
        db.add(competence)

    # 6. Tout commiter en une seule transaction
    db.commit()

    return {
        "message": "CV uploadé et sauvegardé",
        "candidat_id": candidat.id,
        "cv_id": cv.id,
        "data": data,
    }


@router.get("/candidats")
def liste_candidats(db: Session = Depends(get_db)):
    candidats = db.query(Candidat).all()
    result = []
    for c in candidats:
        competences = []
        for cv in c.cvs:
            competences += [comp.nom for comp in cv.competences]
        result.append({
            "id": c.id,
            "email": c.email,
            "telephone": c.telephone,
            "competences": competences,
            "nb_cvs": len(c.cvs),
        })
    return result
@router.get("/candidats/{candidat_id}")
def get_candidat(candidat_id: int, db: Session = Depends(get_db)):
    candidat = db.query(Candidat).filter(Candidat.id == candidat_id).first()
    if not candidat:
        raise HTTPException(status_code=404, detail="Candidat non trouvé")
    
    skills = []
    experience = []
    education = []
    for cv in candidat.cvs:
        skills += [comp.nom for comp in cv.competences]
        experience += cv.texte_brut.split(".")[:3] if cv.texte_brut else []
    
    return {
        "id": candidat.id,
        "email": candidat.email,
        "telephone": candidat.telephone,
        "skills": list(dict.fromkeys(skills)),
        "experience": experience,
        "nb_cvs": len(candidat.cvs),
        "created_at": str(candidat.created_at),
    }