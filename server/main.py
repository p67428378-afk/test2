import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import (
    auth,
    modules,
    annotations,
    quizzes,
    progress,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    # Seed initial test data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Interactive Digital Learning Platform for 1st Year MBBS Students API",
    description="RESTful backend services powering interactive canvas medical image annotation, physiological digital animation players, checkpoint quizzes, and student progress tracking for 1st-year MBBS students.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(modules.router)
app.include_router(annotations.router)
app.include_router(quizzes.router)
app.include_router(progress.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "Interactive Digital Learning Platform for 1st Year MBBS Students API",
        "version": "1.0.0",
        "docs_url": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "timestamp": "ok"}
