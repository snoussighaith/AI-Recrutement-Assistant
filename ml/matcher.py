from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Chargement du modèle une seule fois au démarrage
# "all-MiniLM-L6-v2" : léger, rapide, très bon pour la similarité de texte
model = SentenceTransformer("all-MiniLM-L6-v2")

def texte_candidat(candidat: dict) -> str:
    """
    Construit un texte représentatif du candidat.
    On concatène compétences + expérience + formation.
    Plus le texte est riche, meilleur sera le matching.
    """
    parties = []
    if candidat.get("skills"):
        parties.append("Compétences : " + ", ".join(candidat["skills"]))
    if candidat.get("experience"):
        parties.append("Expérience : " + " ".join(candidat["experience"]))
    if candidat.get("education"):
        parties.append("Formation : " + " ".join(candidat["education"]))
    return " ".join(parties)

def matcher_candidats(offre_texte: str, candidats: list[dict]) -> list[dict]:
    """
    Compare une offre d'emploi à une liste de candidats.
    Retourne les candidats triés par score de matching.
    
    offre_texte : description complète de l'offre
    candidats   : liste de dicts avec skills, experience, education
    """
    # 1. Transformer l'offre en vecteur
    offre_vector = model.encode([offre_texte])

    # 2. Transformer chaque candidat en vecteur
    textes_candidats = [texte_candidat(c) for c in candidats]
    candidats_vectors = model.encode(textes_candidats)

    # 3. Calculer la similarité cosinus entre l'offre et chaque candidat
    scores = cosine_similarity(offre_vector, candidats_vectors)[0]

    # 4. Associer chaque candidat à son score et trier
    resultats = []
    for i, candidat in enumerate(candidats):
        resultats.append({
            "candidat_id": candidat.get("id"),
            "email": candidat.get("email"),
            "score": round(float(scores[i]) * 100, 2),  # en pourcentage
            "competences": candidat.get("skills", []),
        })

    # Trier du meilleur au moins bon
    resultats.sort(key=lambda x: x["score"], reverse=True)
    return resultats