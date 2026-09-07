import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware

from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, feedback, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    # Seed default user and admin credentials idempotently
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Customer Feedback Ingestion, AI Sentiment, Admin Insights, Real-Time Alerts & Export API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", settings.ALLOWED_ORIGINS)
allowed_origins = [
    orig.strip() for orig in allowed_origins_raw.split(",") if orig.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Request Validation Error Handler returning 400 Bad Request
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_msg = "; ".join([f"{err['loc'][-1]}: {err['msg']}" for err in errors])
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": f"Validation Error: {error_msg}", "errors": errors},
    )


# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(feedback.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}


@app.get("/")
def root():
    return {
        "message": "Welcome to Customer Feedback Analyzer API",
        "docs_url": "/docs",
        "health": "/health",
    }
