import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from server.database import init_db, seed_data, SessionLocal, get_db
from server.routers import auth, patients, schedules, appointments, medical, billing


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Hospital Management System (HMS) API",
    description="Comprehensive API for Patient Records, Doctor Schedules, Appointments, Medical Records, and Billing.",
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

# Include API Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(schedules.router)
app.include_router(appointments.router)
app.include_router(medical.router)
app.include_router(billing.router)


@app.get("/")
def root():
    """Root status endpoint."""
    return {
        "service": "Hospital Management System (HMS) API",
        "status": "online",
        "docs_url": "/docs",
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check verifying database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connectivity check failed: {str(e)}",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
