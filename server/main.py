import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.app.database import init_db, SessionLocal, seed_data
from server.api.v1.endpoints import navigation, assortment, guardrails


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

# Navigation router
app.include_router(navigation.router, prefix="/api/v1/navigation", tags=["navigation"])

# Assortment router (v1 endpoints)
app.include_router(assortment.router, prefix="/api/v1/assortment", tags=["assortment"])

# Guardrails router (v1 endpoints)
app.include_router(guardrails.router, prefix="/api/v1/guardrails", tags=["guardrails"])


@app.get("/")
def read_root():
    return {"message": "DG Cluster Assortment Advisor API"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
