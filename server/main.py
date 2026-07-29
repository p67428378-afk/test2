import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routes import auth, items, claims, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and seed data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Lost & Found Management System",
    description="API for Lost & Found Management System with AI-powered matching",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
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

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(items.router, prefix="/api/v1/items", tags=["items"])
app.include_router(claims.router, prefix="/api/v1/claims", tags=["claims"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Lost & Found Management System API"}
