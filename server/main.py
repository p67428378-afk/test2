import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import (
    auth,
    evidence,
    chain_of_custody,
    cases,
    audit_logs,
    rbac,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed accounts/demo data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Digital Evidence Management System (DEMS) API",
    description="Secure, legally admissible, and tamper-evident platform for digital evidence management.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(evidence.router)
app.include_router(chain_of_custody.router)
app.include_router(cases.router)
app.include_router(audit_logs.router)
app.include_router(rbac.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "DEMS API Engine", "version": "1.0.0"}


@app.get("/api/v1/health", tags=["Health"])
def api_health_check():
    return {"status": "healthy", "service": "DEMS API Engine", "version": "1.0.0"}
