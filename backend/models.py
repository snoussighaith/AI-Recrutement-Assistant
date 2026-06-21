from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Candidat(Base):
    __tablename__ = "candidats"

    id         = Column(Integer, primary_key=True, index=True)
    nom        = Column(String(100))
    email      = Column(String(150), unique=True, index=True)
    telephone  = Column(String(30))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Un candidat peut avoir plusieurs CV
    cvs = relationship("CV", back_populates="candidat")


class CV(Base):
    __tablename__ = "cvs"

    id           = Column(Integer, primary_key=True, index=True)
    candidat_id  = Column(Integer, ForeignKey("candidats.id"))
    fichier_nom  = Column(String(200))
    texte_brut   = Column(Text)
    date_upload  = Column(DateTime, default=datetime.utcnow)

    # Lien retour vers le candidat
    candidat     = relationship("Candidat", back_populates="cvs")

    # Un CV peut avoir plusieurs compétences
    competences  = relationship("Competence", back_populates="cv")


class Competence(Base):
    __tablename__ = "competences"

    id   = Column(Integer, primary_key=True, index=True)
    cv_id = Column(Integer, ForeignKey("cvs.id"))
    nom  = Column(String(100))

    cv   = relationship("CV", back_populates="competences")

class Offre(Base):
    __tablename__ = "offres"

    id          = Column(Integer, primary_key=True, index=True)
    titre       = Column(String(200))
    description = Column(Text)
    competences = Column(Text)  # compétences requises séparées par virgule
    created_at  = Column(DateTime, default=datetime.utcnow)
    