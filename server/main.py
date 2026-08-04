import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.app.api.v1.assortment import router as assortment_router
from server.app.database import SessionLocal, init_db, seed_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


# Initialize database schema at import time
init_db()
_db = SessionLocal()
try:
    seed_data(_db)
finally:
    _db.close()

app = FastAPI(
    title="DG Cluster Assortment Advisor API",
    version="1.0.0",
    description="Decision-support API for Dollar General Snacks cluster assortment management",
    lifespan=lifespan,
)

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(assortment_router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"message": "Welcome to DG Cluster Assortment Advisor API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
