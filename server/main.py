from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

from server.api.v1.endpoints import (
    auth,
    tournaments,
    players,
    pairings,
    scores,
    standings,
    certificates,
)
from server.database import init_db, seed_data, SessionLocal

# Initialize database tables
init_db()

# Seed initial data
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(
    title="Chess Tournament Management System API",
    version="1.0.0",
    description="FIDE Swiss pairings, match score tracking, live standings, and verifiable digital certificates.",
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

# Include routers under /api/v1
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(tournaments.router, prefix="/api/v1", tags=["tournaments"])
app.include_router(players.router, prefix="/api/v1", tags=["players"])
app.include_router(pairings.router, prefix="/api/v1", tags=["pairings"])
app.include_router(scores.router, prefix="/api/v1", tags=["scores"])
app.include_router(standings.router, prefix="/api/v1", tags=["standings"])
app.include_router(certificates.router, prefix="/api/v1", tags=["certificates"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Chess Tournament Management System API",
        "docs": "/docs",
    }
