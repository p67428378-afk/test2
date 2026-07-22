from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, components, missions, inspections, alerts


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Space Mission Equipment Tracking System",
    description="API for managing spacecraft components, tracking inventory, scheduling inspections, and assigning equipment to missions.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(components.router, prefix="/api/v1", tags=["components"])
app.include_router(missions.router, prefix="/api/v1", tags=["missions"])
app.include_router(inspections.router, prefix="/api/v1", tags=["inspections"])
app.include_router(alerts.router, prefix="/api/v1", tags=["alerts"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Space Mission Equipment Tracking System API"}
