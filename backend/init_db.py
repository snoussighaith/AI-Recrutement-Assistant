from database import engine, Base
import models  # important : importer les modèles pour que Base les connaisse

# Crée toutes les tables dans PostgreSQL si elles n'existent pas encore
Base.metadata.create_all(bind=engine)

print("✅ Tables créées avec succès !")
print("   - candidats")
print("   - cvs")
print("   - competences")