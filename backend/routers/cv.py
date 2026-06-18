from fastapi import APIRouter, UploadFile, File, HTTPException
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../../ml"))
from cv_parser import parse_cv

router = APIRouter()

@router.post("/upload")
async def upload_cv(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés")
    content = await file.read()
    result = parse_cv(content)
    return {"filename": file.filename, "data": result}