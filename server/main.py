import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data
from server.routers import recommendations, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB tables and seed data idempotently
    init_db()
    seed_data()
    yield
    # Shutdown: Clean up resources if needed


app = FastAPI(
    title="Travel Recommendation System API",
    description="API for AI-Powered Travel Recommendations by Destination, Budget, and Interests",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
ALLOWED_ORIGINS = [
    origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(recommendations.router)
app.include_router(health.router)


@app.get("/", tags=["root"])
def root_status():
    return {
        "message": "Welcome to the Travel Recommendation System API",
        "docs_url": "/docs",
        "health_url": "/api/v1/health",
    }
