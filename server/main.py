import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import SessionLocal, init_db, seed_data
from server.routers import (
    auth,
    pets,
    appointments,
    medical_records,
    vaccinations,
    reminders,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed test data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Pet Clinic Management System API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
allowed_origins_raw = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
ALLOWED_ORIGINS = [
    origin.strip() for origin in allowed_origins_raw.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(pets.router)
app.include_router(appointments.router)
app.include_router(medical_records.router)
app.include_router(vaccinations.router)
app.include_router(reminders.router)


@app.get("/health")
@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "pet-clinic-api"}


@app.get("/")
def root():
    return {"message": "Pet Clinic Management API is running", "version": "1.0.0"}
