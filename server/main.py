import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.app.api.v1.emails import router as emails_router
from server.database import SessionLocal, init_db, seed_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    # Seed sample email records if empty
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Email Classification System API",
    description="REST API for AI-assisted email parsing, classification, and review.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS_ENV = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [
    origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(emails_router, prefix="/api/v1")


@app.get("/health", response_model=dict, tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "email-classification-backend"}


@app.get("/", response_model=dict, tags=["Root"])
def root():
    return {
        "message": "Welcome to Email Classification System API",
        "docs_url": "/docs",
        "version": "1.0.0",
    }
