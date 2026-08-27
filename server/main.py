"""FastAPI application entry point for Podcast Discovery Hub."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.config import ALLOWED_ORIGINS
from server.database import init_db
from server.routers import episodes, podcasts

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("podcast_hub")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager to initialize database and seed sample data."""
    logger.info("Initializing Podcast Discovery Hub database...")
    init_db()
    logger.info("Database initialized successfully.")
    yield


app = FastAPI(
    title="Podcast Discovery Hub API",
    description="RESTful API for browsing podcast shows, searching episodes, and streaming metadata.",
    version="1.0.0",
    lifespan=lifespan,
)

# Mandatory CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(podcasts.router)
app.include_router(episodes.router)


@app.get("/health", tags=["system"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "database": "connected"}


@app.get("/", tags=["system"])
def root():
    """Root endpoint providing service metadata."""
    return {
        "message": "Podcast Discovery Hub API",
        "version": "1.0.0",
        "docs": "/docs",
    }
