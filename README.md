# AnnQuote

A quote management system for creating, tracking, and managing business quotes. Built with React, FastAPI, and PostgreSQL.

## Quick Start

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:8000      |
| API Docs | http://localhost:8000/docs |

## Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, React Router 6, Axios   |
| Backend  | FastAPI, SQLAlchemy 2, Pydantic 2 |
| Database | PostgreSQL 16                     |
| Infra    | Docker, Docker Compose, Nginx     |

## Features

- Create and manage quotes with line items and automatic totals
- Client management (create, edit, delete)
- Quote status workflow: Draft → Sent → Accepted / Rejected / Expired
- Dashboard with stats and recent activity
- Search and filter quotes by title, client, or status
- Light and dark mode (follows system preference)
- Responsive mobile layout

## Project Structure

```
AnnQuote/
├── frontend/               React JS app
│   └── src/
│       ├── App/            Root layout + router
│       ├── components/
│       │   ├── Dashboard/
│       │   ├── QuoteList/
│       │   ├── QuoteForm/
│       │   ├── QuoteDetail/
│       │   ├── ClientList/
│       │   └── StatusBadge/
│       ├── services/
│       │   └── api.js      Axios API client
│       └── index.js        React entry point
├── backend/                FastAPI app
│   ├── main.py             App entry, CORS, routers
│   ├── models.py           SQLAlchemy models
│   ├── schemas.py          Pydantic schemas
│   ├── database.py         DB session + engine
│   └── routers/
│       ├── quotes.py       Quote CRUD + stats
│       └── clients.py      Client CRUD
├── docs/                   Project documentation
│   ├── architecture.md
│   ├── frontend.md
│   ├── backend.md
│   └── components/
├── docker-compose.yml
└── .env
```

## Documentation

- [Architecture](docs/architecture.md) — system design and decisions
- [Frontend](docs/frontend.md) — React structure and CSS conventions
- [Backend](docs/backend.md) — API endpoints and database schema
- [Components](docs/components/) — per-component reference

## Development (without Docker)

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
DATABASE_URL=postgresql://... uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

## Environment Variables

| Variable            | Default        | Description              |
|---------------------|----------------|--------------------------|
| `POSTGRES_USER`     | `annquote`     | Database user            |
| `POSTGRES_PASSWORD` | `annquote_pass`| Database password        |
| `POSTGRES_DB`       | `annquote_db`  | Database name            |
| `SECRET_KEY`        | —              | App secret (change this) |
| `REACT_APP_API_URL` | `http://localhost:8000` | Backend URL   |
