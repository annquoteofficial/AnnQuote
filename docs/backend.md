# Backend

## Stack

- **FastAPI** — HTTP framework, automatic OpenAPI at `/docs`
- **SQLAlchemy 2** — ORM with declarative models
- **Pydantic 2** — request/response validation and serialization
- **psycopg2** — PostgreSQL driver
- **Alembic** — migration tooling (available, not yet wired to auto-run)

## File Structure

```
backend/
  main.py         App factory: creates FastAPI app, adds CORS, registers routers,
                  runs Base.metadata.create_all() on startup
  models.py       SQLAlchemy ORM models: Client, Quote, QuoteItem, QuoteStatus
  schemas.py      Pydantic schemas for request bodies and response shapes
  database.py     Engine creation from DATABASE_URL, SessionLocal, get_db() dependency
  routers/
    quotes.py     /quotes endpoints
    clients.py    /clients endpoints
```

## Database Schema

### clients

| Column     | Type         | Notes              |
|------------|--------------|--------------------|
| id         | INTEGER PK   | auto-increment     |
| name       | VARCHAR(200) | required           |
| email      | VARCHAR(200) | unique, indexed    |
| phone      | VARCHAR(50)  | nullable           |
| company    | VARCHAR(200) | nullable           |
| created_at | TIMESTAMPTZ  | server default NOW |

### quotes

| Column       | Type         | Notes                                          |
|--------------|--------------|------------------------------------------------|
| id           | INTEGER PK   | auto-increment                                 |
| quote_number | VARCHAR(50)  | unique, format `QT-{YEAR}-{NNNN}`             |
| title        | VARCHAR(300) | required                                       |
| status       | ENUM         | draft / sent / accepted / rejected / expired  |
| notes        | TEXT         | nullable                                       |
| valid_until  | TIMESTAMPTZ  | nullable                                       |
| created_at   | TIMESTAMPTZ  | server default NOW                             |
| updated_at   | TIMESTAMPTZ  | auto-updated on change                         |
| client_id    | INTEGER FK   | → clients.id, CASCADE DELETE                  |

`total` is a computed Python `@property` (sum of `quantity × unit_price` across items). It is not stored in the database.

### quote_items

| Column      | Type         | Notes                         |
|-------------|--------------|-------------------------------|
| id          | INTEGER PK   | auto-increment                |
| description | VARCHAR(500) | required                      |
| quantity    | FLOAT        | required, default 1           |
| unit_price  | FLOAT        | required                      |
| quote_id    | INTEGER FK   | → quotes.id, CASCADE DELETE   |

## API Endpoints

Interactive docs available at `http://localhost:8000/docs`.

### Health

| Method | Path      | Description     |
|--------|-----------|-----------------|
| GET    | `/health` | Liveness check  |

### Quotes

| Method | Path              | Description                              |
|--------|-------------------|------------------------------------------|
| GET    | `/quotes/stats`   | Counts by status + total portfolio value |
| GET    | `/quotes/`        | List quotes (supports `search`, `status`, `skip`, `limit`) |
| POST   | `/quotes/`        | Create quote with line items             |
| GET    | `/quotes/{id}`    | Get single quote                         |
| PUT    | `/quotes/{id}`    | Update quote (partial — uses `exclude_unset`) |
| DELETE | `/quotes/{id}`    | Delete quote and its items               |

**Query params for GET /quotes/:**

| Param    | Type   | Description                              |
|----------|--------|------------------------------------------|
| `search` | string | Filters by `quote.title` OR `client.name` (case-insensitive LIKE) |
| `status` | enum   | One of: `draft`, `sent`, `accepted`, `rejected`, `expired` |
| `skip`   | int    | Offset for pagination (default 0)        |
| `limit`  | int    | Page size (default 50)                   |

**POST /quotes/ body:**

```json
{
  "title": "Website Redesign",
  "client_id": 1,
  "notes": "Includes 3 revision rounds",
  "valid_until": "2026-06-01T00:00:00Z",
  "items": [
    { "description": "Design", "quantity": 1, "unit_price": 2500.00 },
    { "description": "Development", "quantity": 40, "unit_price": 95.00 }
  ]
}
```

**PUT /quotes/{id} body** — all fields optional:

```json
{
  "status": "sent",
  "items": [...]
}
```

When `items` is provided, existing items are deleted and replaced. When omitted, items are untouched.

### Clients

| Method | Path              | Description        |
|--------|-------------------|--------------------|
| GET    | `/clients/`       | List all clients   |
| POST   | `/clients/`       | Create client      |
| GET    | `/clients/{id}`   | Get single client  |
| PUT    | `/clients/{id}`   | Update client      |
| DELETE | `/clients/{id}`   | Delete client (cascades to quotes) |

**POST /clients/ body:**

```json
{
  "name": "Acme Corp",
  "email": "billing@acme.com",
  "company": "Acme Corporation",
  "phone": "+1 555 0100"
}
```

Email must be unique. Duplicate email returns `400 Bad Request`.

## CORS

All origins, methods, and headers are allowed in development. Restrict `allow_origins` in `main.py` before going to production.

## Error Responses

All errors follow FastAPI's default format:

```json
{ "detail": "Client not found" }
```

| Status | Meaning                       |
|--------|-------------------------------|
| 400    | Validation or business rule failure (e.g. duplicate email) |
| 404    | Resource not found            |
| 422    | Request body failed Pydantic validation |
