import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import (
    tours,
    guides,
    schedules,
    bookings,
    attendance,
    reviews,
    admin,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema and seed default data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Museum Tour Management System API",
    description="API for guided tour scheduling, bookings, attendance tracking, and visitor feedback reviews.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(tours.router)
app.include_router(guides.router)
app.include_router(schedules.router)
app.include_router(bookings.router)
app.include_router(attendance.router)
app.include_router(reviews.router)
app.include_router(admin.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "Museum Tour Management System"}
