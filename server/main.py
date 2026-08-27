import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.app.api.v1.projects import router as projects_router
from server.app.api.v1.leads import router as leads_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema and seed data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Freelance Portfolio & Lead Capture API",
    description="RESTful API for showcasing portfolio projects and capturing client leads.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS Middleware
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

# Register API v1 Routers
app.include_router(projects_router, prefix="/api/v1")
app.include_router(leads_router, prefix="/api/v1")


@app.get("/", tags=["health"])
def root():
    return {"message": "Freelance Portfolio API is running", "version": "1.0.0"}


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "healthy"}
