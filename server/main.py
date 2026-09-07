import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import visitors, deliveries, alerts


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for database initialization and seeding."""
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Visitor Management System API",
    description="RESTful API for residential visitor pre-approval, QR entry validation, delivery tracking, and security alerts.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS_ENV = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [
    origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(visitors.router)
app.include_router(deliveries.router)
app.include_router(alerts.router)


@app.get("/")
def root():
    return {
        "message": "Visitor Management System API is running",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy"}


def generate_openapi_json():
    """Generates openapi.json at the repository root and server/ directory."""
    try:
        schema = app.openapi()
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        server_dir = os.path.dirname(os.path.abspath(__file__))

        root_openapi = os.path.join(base_dir, "openapi.json")
        server_openapi = os.path.join(server_dir, "openapi.json")

        with open(root_openapi, "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2)

        with open(server_openapi, "w", encoding="utf-8") as f:
            json.dump(schema, f, indent=2)
    except Exception as e:
        print(f"Warning: Failed to generate openapi.json: {e}")


generate_openapi_json()
