import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, tours, schedules, bookings, attendance


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic (if any)


app = FastAPI(
    title="Museum Tour Management System API",
    version="1.0.0",
    description="API for booking tours, schedule management, guide assignments, and attendance tracking.",
    lifespan=lifespan,
)

# CORS Middleware Configuration
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
app.include_router(tours.router)
app.include_router(schedules.router)
app.include_router(bookings.router)
app.include_router(attendance.router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "app": "Museum Tour Management System API",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
