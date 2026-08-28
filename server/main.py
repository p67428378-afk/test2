import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.routes import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed default accounts
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Employee Leave Management System API",
    description="Backend API for managing employee leave applications, manager approvals, and leave balances.",
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
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

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Employee Leave Management System API",
        "docs_url": "/docs",
        "health_check": "/api/v1/health",
    }
