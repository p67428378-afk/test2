import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
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
    # Initialize DB schema
    init_db()
    # Seed default accounts and data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Pet Clinic Management System API",
    description="API for managing pets, appointments, medical visit records, vaccinations, and reminders.",
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

# Include Routers
app.include_router(auth.router)
app.include_router(pets.router)
app.include_router(appointments.router)
app.include_router(medical_records.router)
app.include_router(vaccinations.router)
app.include_router(reminders.router)


@app.get("/")
def root():
    return {"message": "Pet Clinic Management System API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
