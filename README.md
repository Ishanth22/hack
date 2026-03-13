# 🚀 Startup Progress Monitor

> India's Startup Intelligence Platform — ML-powered analytics for tracking growth, detecting risk, and benchmarking startup performance.

![Stack](https://img.shields.io/badge/Frontend-React_+_Plotly-61DAFB?style=flat-square)
![Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square)
![Stack](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square)
![Stack](https://img.shields.io/badge/Deploy-Docker_Compose-2496ED?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 Health Score | 0–100 composite score (revenue, users, growth, runway) |
| ⚡ Risk Detection | Rule-based alerts: runway, burn rate, revenue decline |
| 🏆 Leaderboard | Ranked by health score + momentum |
| 📰 News Sentiment | TextBlob NLP on NewsAPI articles |
| 📈 Charts | Plotly interactive charts (revenue, users, burn, employees) |
| 🔮 Risk Probability | Probability score with Low/Medium/High/Critical levels |

---

## 🏗 Architecture

```
startup-monitor/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── database.py          # MongoDB connection
│   │   ├── routes/
│   │   │   ├── startup_routes.py
│   │   │   ├── metrics_routes.py
│   │   │   └── analytics_routes.py
│   │   ├── analytics/
│   │   │   ├── growth.py        # Growth rate calculations
│   │   │   ├── runway.py        # Runway analysis
│   │   │   ├── scoring.py       # Health score engine
│   │   │   ├── risk_detection.py
│   │   │   └── sentiment.py     # News sentiment (NewsAPI + TextBlob)
│   │   └── schemas/
│   │       ├── startup_schema.py
│   │       └── metrics_schema.py
│   ├── seed.py                  # Demo data generator (10 Indian startups)
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx         # Overview dashboard
│       │   ├── Leaderboard.jsx
│       │   ├── StartupDetail.jsx
│       │   ├── SubmitMetrics.jsx
│       │   └── RegisterStartup.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── HealthScoreCard.jsx
│       │   ├── AlertBanner.jsx
│       │   ├── StartupChart.jsx (Plotly)
│       │   ├── SentimentWidget.jsx
│       │   └── StatCard.jsx
│       └── services/api.js
└── docker-compose.yml
```

---

## 🚀 Quick Start — Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Ports 3000, 8000, 27017 free

### 1. Clone & configure

```bash
git clone <your-repo>
cd startup-monitor
cp .env.example .env
# Optionally add your NewsAPI key in .env
```

### 2. Launch everything

```bash
docker-compose up --build
```

Wait ~2 minutes for the build. Then:

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ API Docs | http://localhost:8000/docs |
| 🗄 MongoDB | mongodb://localhost:27017 |

### 3. Seed demo data (10 Indian startups)

```bash
# While containers are running:
docker exec spm_backend python seed.py
```

---

## 💻 Local Development (No Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m textblob.download_corpora

# Start MongoDB locally or use MongoDB Atlas
MONGO_URI=mongodb://localhost:27017 uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> The frontend proxies `/api/*` to `http://localhost:8000` via Vite config.

---

## 🌐 API Reference

### Startups
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/startups` | Register a new startup |
| `GET` | `/api/startups` | List all startups |
| `GET` | `/api/startups/{id}` | Get startup details |
| `DELETE` | `/api/startups/{id}` | Delete a startup |

### Metrics
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/metrics` | Submit monthly metrics |
| `GET` | `/api/metrics/{startup_id}` | Get metrics history |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/startup/{id}/analysis` | Full analysis (score, risks, sentiment) |
| `GET` | `/api/leaderboard` | Ranked startup list |
| `GET` | `/api/analytics/overview` | Platform-wide stats |
| `GET` | `/api/analytics/sentiment/{id}` | News sentiment for startup |

---

## 📐 Health Score Formula

```
health_score (0–100) =
  0.35 × normalize(revenue_growth)  +
  0.30 × normalize(user_growth)     +
  0.20 × normalize(employee_growth) +
  0.15 × runway_score
```

**Momentum:**
```
momentum = recent_growth × 0.6 + previous_growth × 0.4
```

---

## ⚠️ Risk Detection Rules

| Condition | Alert Level |
|---|---|
| Runway < 3 months | CRITICAL |
| Runway < 6 months | HIGH |
| Runway < 12 months | WARNING |
| Burn rate up >75% MoM | CRITICAL |
| Burn rate up >50% MoM | HIGH |
| Revenue down >30% | HIGH |
| Revenue down >15% | WARNING |
| User base declining | WARNING |
| Workforce reduced >15% | WARNING |

---

## 🌍 Deploy to Render / Railway

### Render (Free tier available)

1. Push to GitHub
2. Create **Web Service** → connect repo → set root to `backend/`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Env var: `MONGO_URI` → your MongoDB Atlas URI
3. Create **Static Site** → root `frontend/`
   - Build: `npm install && npm run build`
   - Publish: `dist`
   - Env var: `VITE_API_URL` → your backend URL + `/api`

### Railway

```bash
railway login
railway init
railway up
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `NEWS_API_KEY` | No | From [newsapi.org](https://newsapi.org) — enables real news |

---

## 📦 Tech Stack

- **Frontend**: React 18, React Router v6, TailwindCSS, Plotly.js, Axios
- **Backend**: FastAPI, Pydantic v2, PyMongo
- **Database**: MongoDB 7
- **Analytics**: NumPy, Pandas, TextBlob
- **Infra**: Docker, Nginx

---

## 🎨 Design System

Dark fintech theme with:
- **Fonts**: Syne (display) + DM Sans (body) + JetBrains Mono (data)
- **Palette**: `#090d12` base · `#00ff88` green · `#00e5ff` cyan · `#ff3d71` red · `#ffb800` amber
- Glass morphism cards, neon glows, animated SVG health ring, CSS grid background

---

## 📄 License

MIT — Built for India's startup ecosystem 🇮🇳
