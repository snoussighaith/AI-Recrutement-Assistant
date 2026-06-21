from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

# Charge les variables du fichier .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Le moteur = la connexion physique à PostgreSQL
engine = create_engine(DATABASE_URL)

# La session = une transaction ouverte avec la BDD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# La classe de base dont hériteront tous les modèles
class Base(DeclarativeBase):
    pass

# Dépendance FastAPI : ouvre une session par requête, la ferme après
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()