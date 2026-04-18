# Architecture

## Overview

AnnQuote is a three-tier web application:

```
Browser
  └── React SPA (port 3000, served by Nginx)
        └── FastAPI REST API (port 8000)
              └── PostgreSQL (port 5432)
```

All three run as Docker containers orchestrated by Docker Compose. The frontend container is a multi-stage build: Node builds the React app, then Nginx serves the static output and proxies `/api/` to the backend.

## Request Flow

```
User action
  → React component calls services/api.js (Axios)
  → HTTP request to FastAPI router
  → Pydantic validates request body
  → SQLAlchemy queries PostgreSQL
  → Pydantic serializes response
  → React updates state and re-renders
```

## Data Model

```
Client 1──* Quote 1──* QuoteItem
```

- A **Client** has a name, email, company, and phone.
- A **Quote** belongs to one Client, has a status enum, line items, and a computed `total` property.
- A **QuoteItem** has a description, quantity, and unit_price. Subtotal is computed at read time.

Quote status transitions (enforced by the frontend UI, not the backend):

```
draft → sent → accepted
              → rejected
              → expired
```

## Tech Decisions

**FastAPI over Django/Flask** — async-ready, automatic OpenAPI docs at `/docs`, and Pydantic schema sharing between request validation and response serialization avoids duplication.

**SQLAlchemy 2 over raw SQL** — ORM handles relationships and cascades (deleting a Client cascades to their Quotes and QuoteItems). `Base.metadata.create_all()` on startup means no migration tooling is needed for development; Alembic is in `requirements.txt` for when it's needed in production.

**React without a UI library** — all styles are handwritten CSS, split across per-component files following the project's 6-file convention. This avoids bundle bloat and keeps dark/mobile modes explicit and auditable.

**Nginx as frontend server** — handles static file serving with caching headers and proxies `/api/` to the backend container. This means the frontend never calls the backend directly by hostname, only through the proxy.

**PostgreSQL over SQLite** — chosen from the start to avoid migration pain later. The Docker healthcheck ensures the backend waits for Postgres to be ready before starting.

## Container Communication

```
frontend (nginx) → backend:8000   (via Docker internal network)
backend          → db:5432        (via Docker internal network)
```

`DATABASE_URL` in the backend uses the service name `db` as the host, which Docker Compose resolves automatically.

## Scaling Considerations

- The backend is stateless; multiple replicas can run behind a load balancer.
- The frontend is fully static after build; a CDN can serve it.
- PostgreSQL is the single stateful component. The `postgres_data` named volume persists data across container restarts.
