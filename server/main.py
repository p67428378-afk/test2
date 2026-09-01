"""FastAPI application entrypoint for TaskFlow platform."""

import os
from contextlib import asynccontextmanager
from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import analytics, auth, comments, projects, tasks
from server.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown."""
    init_db()
    yield


app = FastAPI(
    title="TaskFlow API",
    description="Task Management & Team Workflow System API with User Authentication, Project & Task Tracking, Analytics, and Escalation Triggers",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 Router
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(auth.router)
api_v1_router.include_router(projects.router)
api_v1_router.include_router(tasks.router)
api_v1_router.include_router(comments.router)
api_v1_router.include_router(analytics.router)

app.include_router(api_v1_router)


@app.get("/", tags=["health"])
def root():
    return {
        "message": "Welcome to TaskFlow API",
        "status": "healthy",
        "version": "1.0.0",
    }


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
