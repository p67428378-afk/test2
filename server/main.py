import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import (
    sites,
    artifacts,
    teams,
    media,
    lab_analyses,
    publications,
    dashboard,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database schema & seed initial accounts/data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="Archaeological Excavation Management System API",
    description="REST API for recording excavation sites, artifacts, teams, GPS coordinates, media, lab analyses, and publication citations.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(sites.router)
app.include_router(artifacts.router)
app.include_router(teams.router)
app.include_router(media.router)
app.include_router(lab_analyses.router)
app.include_router(publications.router)
app.include_router(dashboard.router)


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "ArchExcav API",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
