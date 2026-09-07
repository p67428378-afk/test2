import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.api.v1.auth import router as auth_router
from server.api.v1.courses import router as courses_router
from server.api.v1.enrollments import router as enrollments_router
from server.api.v1.assignments import router as assignments_router
from server.api.v1.submissions import router as submissions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed default data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="LMS Portal for College Students REST API Service",
    lifespan=lifespan,
)

# CORS Middleware Configuration
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

# Include API Routers under /api/v1
app.include_router(auth_router, prefix="/api/v1")
app.include_router(courses_router, prefix="/api/v1")
app.include_router(enrollments_router, prefix="/api/v1")
app.include_router(assignments_router, prefix="/api/v1")
app.include_router(submissions_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "Welcome to LMS Portal API",
        "version": "1.0.0",
        "docs_url": "/docs",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "lms-portal-backend"}
