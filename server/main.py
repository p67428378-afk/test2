import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, equipment, rentals, deposits, returns


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    # Seed initial users & equipment idempotently
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Equipment Rental Management System API",
    description="API for managing cameras, drones, and construction tools rentals, security deposits, and late fees.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware (MANDATORY for fullstack projects)
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

# Include Routers
app.include_router(auth.router)
app.include_router(equipment.router)
app.include_router(rentals.router)
app.include_router(deposits.router)
app.include_router(returns.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Equipment Rental Management System API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
