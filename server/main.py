from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os
from contextlib import asynccontextmanager

from server.database import init_db, seed_data, SessionLocal
from server.routers import items, claims, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Lost and Found Management System API",
    version="1.0.0",
    description="Report lost or found items, AI suggests possible matches, admins verify ownership, and claim history is maintained.",
    lifespan=lifespan,
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

# Include routers under /api/v1
app.include_router(items.router, prefix="/api/v1", tags=["items"])
app.include_router(claims.router, prefix="/api/v1", tags=["claims"])
app.include_router(admin.router, prefix="/api/v1", tags=["admin"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Lost and Found Management System API",
        "docs": "/docs",
    }
