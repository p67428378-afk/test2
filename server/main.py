from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from .database import init_db, seed_data, SessionLocal
from .routers import auth, items, claims


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Lost and Found Item Management System", version="1.0.0", lifespan=lifespan
)

# CORS Middleware
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

# Include routers
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(claims.router)


@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Lost and Found Item Management System API"}
