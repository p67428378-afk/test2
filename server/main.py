import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.app.auth.router import router as auth_router
from server.app.patients.router import router as patients_router
from server.app.doctors.router import router as doctors_router
from server.app.appointments.router import router as appointments_router
from server.app.emr.router import router as emr_router
from server.app.billing.router import router as billing_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed default users/data idempotently
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Hospital Management System API",
    description="Enterprise API for Patient Registration, Doctor Scheduling, Appointments, EMR, and Billing",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS Middleware
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", settings.ALLOWED_ORIGINS)
allowed_origins = [
    origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Subsystem Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(patients_router, prefix="/api/v1")
app.include_router(doctors_router, prefix="/api/v1")
app.include_router(appointments_router, prefix="/api/v1")
app.include_router(emr_router, prefix="/api/v1")
app.include_router(billing_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "hospital-management-system",
        "version": "1.0.0",
    }
