from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError, DBAPIError
import os

from server.api.v1.endpoints import auth, habits, streaks, lessons
from server.database import init_db, seed_data, SessionLocal

# Initialize database tables
init_db()

# Seed initial data
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(
    title="Health Habits Learning Platform for Kids API",
    description="COPPA-compliant, gamified REST API for tracking health habits, streaks, and badge rewards for children.",
    version="1.0.0",
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


# Graceful exception handler for Database Connection Timeouts / Operational Errors
@app.exception_handler(OperationalError)
@app.exception_handler(DBAPIError)
async def db_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": "Service temporarily unavailable"},
    )


# Include routers under /api/v1
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(habits.router, prefix="/api/v1", tags=["habits"])
app.include_router(streaks.router, prefix="/api/v1", tags=["streaks"])
app.include_router(lessons.router, prefix="/api/v1", tags=["lessons"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Health Habits Learning Platform for Kids API",
        "version": "1.0.0",
        "docs_url": "/docs",
    }
