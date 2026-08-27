import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.api.v1.endpoints.calculator import router as calculator_router

app = FastAPI(
    title="Tip Calculator API",
    description="Stateless Tip Calculator REST API providing calculation and splitting endpoints.",
    version="1.0.0",
)

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

app.include_router(calculator_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    return {"status": "ok", "service": "tip-calculator-api"}


@app.get("/api/v1/health", tags=["Health"])
def api_health_check():
    """API versioned health check endpoint."""
    return {"status": "ok", "version": "1.0.0"}
