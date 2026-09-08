import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import (
    auth,
    rooms,
    reservations,
    checkin_checkout,
    invoices,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed default accounts & sample data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Hotel Management System API",
    description="Backend API for room inventory, reservations, front-desk check-in/out, and billing operations.",
    version="1.0.0",
    lifespan=lifespan,
)

# Mandatory CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(reservations.router)
app.include_router(checkin_checkout.router)
app.include_router(invoices.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy", "service": "hotel-management-api", "version": "1.0.0"}


@app.get("/", tags=["root"])
def root():
    return {"message": "Hotel Management System API is running", "docs": "/docs"}
