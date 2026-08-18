import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import categories, expenses

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema and seed default data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Expense Tracker API",
    description="RESTful API service for tracking and reporting expenses",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router, prefix="/api/v1")
app.include_router(expenses.router, prefix="/api/v1")


@app.get("/")
@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "Expense Tracker API", "version": "1.0.0"}
