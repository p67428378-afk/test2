import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.routers import poses, routines


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Yoga Pose Dictionary & Custom Routine Builder API",
    description="API for exploring yoga pose alignment cues and constructing custom routines.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
ALLOWED_ORIGINS_RAW = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
ALLOWED_ORIGINS = [
    origin.strip() for origin in ALLOWED_ORIGINS_RAW.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(poses.router)
app.include_router(routines.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Yoga Pose Dictionary & Custom Routine Builder API",
        "docs_url": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "yoga-api"}
