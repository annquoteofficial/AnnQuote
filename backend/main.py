from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import quotes, clients, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AnnQuote API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(quotes.router)
app.include_router(clients.router)


@app.get("/health")
def health():
    return {"status": "ok"}
