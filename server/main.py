import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data
from server.api.v1.todos import router as todos_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed data on startup
    init_db()
    seed_data()
    yield


app = FastAPI(
    title="CRUD-Based TODO List API",
    description="REST API for managing TODO tasks with full CRUD operations",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware setup
ALLOWED_ORIGINS_ENV = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
)
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
@app.get("/api/v1/health", tags=["health"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}


app.include_router(todos_router, prefix="/api/v1")
