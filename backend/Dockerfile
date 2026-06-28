# Image de base Python 3.11 (plus stable que 3.13 pour les libs ML)
FROM python:3.11-slim

# Dossier de travail dans le container
WORKDIR /app

# Copie les dépendances en premier (optimisation cache Docker)
COPY requirements.txt .

# Installe les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copie tout le code
COPY . .

# Expose le port
EXPOSE 8000

# Commande de démarrage
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]