"""FastAPI Main Application Entrypoint."""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data
from server.routers.documents import router as documents_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    init_db()
    seed_data()
    yield


app = FastAPI(
    title="Browser Markdown Editor API",
    description="Backend REST API for saving, updating, loading, and listing Markdown documents.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(documents_router)


@app.get("/health", tags=["system"])
def health_check():
    """Service health check endpoint."""
    return {"status": "healthy", "service": "browser-markdown-editor-backend"}


@app.get("/", tags=["system"])
def root():
    """Root welcoming endpoint."""
    return {
        "message": "Browser Markdown Editor API",
        "docs_url": "/docs",
        "health": "/health",
    }
