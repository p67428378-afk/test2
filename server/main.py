import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.app.database import init_db, SessionLocal, seed_data
from server.app.api import kpis, skus, scenarios, submissions


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


# Initialize database tables immediately on import as well
init_db()
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(
    title="DG Cluster Assortment Advisor API",
    version="1.0.0",
    description="Backend API for Dollar General Cluster Assortment Advisor Dashboard",
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

# Include routers
app.include_router(kpis.router, prefix="/api/v1/assortment", tags=["kpis"])
app.include_router(skus.router, prefix="/api/v1/assortment", tags=["skus"])
app.include_router(scenarios.router, prefix="/api/v1/assortment", tags=["scenarios"])
app.include_router(
    submissions.router, prefix="/api/v1/assortment", tags=["submissions"]
)


@app.get("/")
def read_root():
    return {"message": "DG Cluster Assortment Advisor API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
