import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.api.v1.endpoints import (
    dashboard,
    sites,
    artifacts,
    teams,
    media,
    lab,
    publications,
    stratigraphy,
    custody,
    qr,
    ml,
    sync,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    init_db()
    # Seed initial test data idempotently
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Archaeological Excavation Management System API",
    version="2.0.0",
    description="Backend API for 3D stratigraphy, offline PWA sync, QR chain-of-custody, and ML material classification.",
    lifespan=lifespan,
)

# CORS middleware configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register v1 routers
api_v1_prefix = "/api/v1"
app.include_router(dashboard.router, prefix=api_v1_prefix)
app.include_router(sites.router, prefix=api_v1_prefix)
app.include_router(artifacts.router, prefix=api_v1_prefix)
app.include_router(teams.router, prefix=api_v1_prefix)
app.include_router(media.router, prefix=api_v1_prefix)
app.include_router(lab.router, prefix=api_v1_prefix)
app.include_router(publications.router, prefix=api_v1_prefix)
app.include_router(stratigraphy.router, prefix=api_v1_prefix)
app.include_router(custody.router, prefix=api_v1_prefix)
app.include_router(qr.router, prefix=api_v1_prefix)
app.include_router(ml.router, prefix=api_v1_prefix)
app.include_router(sync.router, prefix=api_v1_prefix)


@app.get("/")
def root():
    return {
        "system": "Archaeological Excavation Management System",
        "version": "2.0.0",
        "status": "healthy",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
