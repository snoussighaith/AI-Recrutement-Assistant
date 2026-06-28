import unicodedata

import fitz  # PyMuPDF
import re
from typing import Optional

def extract_text(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_email(text: str) -> Optional[str]:
    # Supprimer les caractères Unicode invisibles
    text = "".join(
        char for char in text
        if unicodedata.category(char) != "Cf"
    )

    # Remplacer les espaces multiples
    text = " ".join(text.split())

    # Recherche de l'email
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

    match = re.search(email_pattern, text)

    if match:
        print(f"Email trouvé : {match.group(0)}")
        return match.group(0)

    print("Aucun email trouvé")
    return None

def extract_phone(text: str) -> Optional[str]:
    # Nettoie les espaces invisibles avant la recherche
    text_clean = " ".join(text.split())
    match = re.search(r"(\+?\d[\d\s\-().]{7,}\d)", text_clean)
    return match.group(0).strip() if match else None

def extract_skills(text: str) -> list[str]:
    SKILLS_LIST = [
        "python", "sql", "r", "java", "javascript", "typescript",
        "machine learning", "deep learning", "nlp", "computer vision",
        "tensorflow", "pytorch", "scikit-learn", "keras",
        "pandas", "numpy", "matplotlib", "seaborn",
        "fastapi", "django", "flask", "react", "vue",
        "docker", "kubernetes", "git", "aws", "gcp", "azure",
        "postgresql", "mongodb", "mysql", "redis",
        "spark", "hadoop", "airflow", "dbt",
        "tableau", "power bi", "looker",
    ]
    text_lower = text.lower()
    found = [s for s in SKILLS_LIST if s in text_lower]
    return list(dict.fromkeys(found))

def extract_sections(text: str) -> dict:
    sections = {"experience": [], "education": [], "summary": ""}
    exp_kw = r"(expérience|experience|parcours professionnel|emploi|poste)"
    edu_kw = r"(formation|education|diplôme|études|scolarité)"
    lines = text.split("\n")
    current_section = None
    buffer = []

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue
        if re.search(exp_kw, line_clean, re.IGNORECASE):
            current_section = "experience"
        elif re.search(edu_kw, line_clean, re.IGNORECASE):
            if buffer and current_section:
                sections[current_section].append(" ".join(buffer))
            buffer = []
            current_section = "education"
        elif current_section:
            buffer.append(line_clean)

    if buffer and current_section:
        sections[current_section].append(" ".join(buffer))
    return sections

def parse_cv(pdf_bytes: bytes) -> dict:
    text = extract_text(pdf_bytes)
    sections = extract_sections(text)
    return {
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "experience": sections["experience"],
        "education": sections["education"],
        "raw_text": text[:500] + "..." if len(text) > 500 else text,
    }