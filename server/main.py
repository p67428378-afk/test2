import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.routers import tours, guides, schedules, bookings, attendance
from server.schemas import HealthResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize schema & seed default data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Museum Tour Management System API",
    description="Backend API for managing museum tours, schedules, bookings, guide assignments, and attendance tracking.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [
    origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(tours.router)
app.include_router(guides.router)
app.include_router(schedules.router)
app.include_router(bookings.router)
app.include_router(attendance.router)


@app.get("/health", response_model=HealthResponse, tags=["Health"])
@app.get("/api/v1/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(status="ok", version="1.0.0")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Museum Tour Management System API",
        "docs_url": "/docs",
        "health_url": "/api/v1/health",
    }
