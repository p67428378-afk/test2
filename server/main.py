import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, species, plants, schedules


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed test accounts & species
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="SproutCare Houseplant Care API",
    description="Backend API for species identification, plant care guides, and watering schedule management.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware for fullstack integration
raw_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
ALLOWED_ORIGINS = [
    origin.strip() for origin in raw_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(species.router, prefix="/api/v1/species", tags=["Species"])
app.include_router(plants.router, prefix="/api/v1/plants", tags=["Plants"])
app.include_router(schedules.router, prefix="/api/v1/schedules", tags=["Schedules"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "SproutCare Houseplant Care API"}


@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to SproutCare Houseplant Care API", "version": "1.0.0"}
