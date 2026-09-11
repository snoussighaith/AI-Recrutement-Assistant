from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

# Charge les variables du fichier .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Le moteur = la connexion physique à PostgreSQL
if not DATABASE_URL:
    # Développement local : fallback vers sqlite pour faciliter les tests sans Postgres
    print("⚠️  DATABASE_URL non défini, utilisation de sqlite:///.local_dev.db pour le dev local")
    DATABASE_URL = "sqlite:///./.local_dev.db"

# Le moteur = la connexion physique à PostgreSQL (ou sqlite en fallback)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})

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