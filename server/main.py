import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, performances, volunteers, tickets, crowd


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup DB init and seeding
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown logic if any


app = FastAPI(
    title="Music Festival Management System Core Platform",
    description="Unified API for artist scheduling, volunteer coordination, ticket validation, and crowd analytics.",
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
app.include_router(performances.router)
app.include_router(volunteers.router)
app.include_router(tickets.router)
app.include_router(crowd.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Music Festival Management System Core Platform",
        "docs": "/docs",
    }
