import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from server.database import init_db, seed_data, SessionLocal, get_db
from server.routers import products, claims, documents
from server.crud import evaluate_all_warranties

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000",
).split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema and seed test accounts on startup
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Warranty Tracker API",
    description="REST API for product registration, warranty expiry tracking, and service claim management.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(products.router)
app.include_router(claims.router)
app.include_router(documents.router)


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint confirming service and database connectivity."""
    db.execute(text("SELECT 1"))
    return {"status": "healthy", "service": "warranty-tracker", "database": "connected"}


@app.post("/api/v1/expiry/evaluate")
def trigger_expiry_evaluation(db: Session = Depends(get_db)):
    """Manually trigger daily warranty expiry status evaluation and notification check."""
    updated = evaluate_all_warranties(db)
    return {"status": "success", "updated_warranties_count": updated}
