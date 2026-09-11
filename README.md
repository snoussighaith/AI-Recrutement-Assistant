# 🤖 AI Recrutement Assistant

Système intelligent de recrutement full-stack avec matching IA par embeddings NLP.

![Dashboard](screenshot_dashboard.png)

## ✨ Fonctionnalités

- 📄 **Parser CV** — Extraction automatique email, téléphone, compétences depuis PDF
- 🎯 **Smart Matching** — Score de similarité entre offres et candidats via embeddings
- 📊 **Dashboard Analytics** — KPIs, graphiques, top compétences
- 👥 **Gestion candidats** — Liste complète avec filtres par compétences
- 🐳 **Docker** — Déploiement en une commande

## 🛠️ Stack technique

| Couche | Technologies |
|--------|-------------|
| Backend | Python, FastAPI, SQLAlchemy |
| ML/NLP | sentence-transformers, scikit-learn, PyMuPDF |
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Recharts |
| Base de données | PostgreSQL |
| DevOps | Docker, docker-compose |

## 🚀 Démarrage rapide

### Avec Docker (recommandé)
```bash
git clone https://github.com/snoussighaith/AI-Recrutement-Assistant
cd AI-Recrutement-Assistant
docker-compose up --build
```

Ouvre **http://localhost:3000**

### Sans Docker
```bash
# Backend
cd backend
pip install -r requirements.txt
python init_db.py
python -m uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 📸 Screenshots

| Page | Description |
|------|-------------|
| 🏠 Accueil | Hero section avec navigation |
| 📊 Dashboard | KPIs et graphiques en temps réel |
| 📄 Upload CV | Parser PDF avec extraction NLP |
| 🎯 Matching | Score IA candidat/offre |
| 👥 Candidats | Liste avec filtres |

## 🧠 Comment fonctionne le matching ?

1. Le CV est converti en vecteur via `sentence-transformers`
2. L'offre d'emploi est également vectorisée
3. La similarité cosinus mesure la pertinence
4. Les candidats sont classés par score

## 👨‍💻 Auteur

**Ghaith Snoussi** — Master 2 Data Science, ISIMA Mahdia
- LinkedIn: [Ghaith Snoussi](https://www.linkedin.com/in/ghaith-snoussi-951ab2275/)
- GitHub: [@snoussighaith](https://github.com/snoussighaith)
