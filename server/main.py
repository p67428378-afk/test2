import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import SessionLocal, init_db, seed_data
from server.routers import codebase_analyzer, health, recommendations


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Travel Recommendation & Codebase Analyzer API",
    version="1.0.0",
    lifespan=lifespan,
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

# Include API Routers under /api/v1
app.include_router(health.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")
app.include_router(codebase_analyzer.router, prefix="/api/v1")


# Also provide direct health check at /health
@app.get("/health", tags=["health"])
def root_health():
    return {"status": "ok", "service": "travel-recommendations-backend"}
