import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.database import init_db, seed_data, get_db
from server.routers.products import router as products_router
from server.routers.claims import router as claims_router
from server.routers.documents import router as documents_router
from server.services.warranty_service import evaluate_all_warranties


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema and seed default users
    init_db()
    seed_data()
    yield


app = FastAPI(
    title="Warranty Tracker API",
    description="API for registering products, tracking warranties, managing claims, and receipt storage.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
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

# Expiry evaluation router
expiry_router = APIRouter(prefix="/api/v1/expiry", tags=["Expiry Evaluation"])


@expiry_router.post("/evaluate")
def trigger_expiry_evaluation(db: Session = Depends(get_db)):
    """Trigger daily evaluation of warranty statuses and milestone notifications."""
    return evaluate_all_warranties(db)


# Register Routers
app.include_router(products_router)
app.include_router(claims_router)
app.include_router(documents_router)
app.include_router(expiry_router)


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "Warranty Tracker API"}


@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to Warranty Tracker API"}
