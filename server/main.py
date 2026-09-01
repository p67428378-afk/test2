import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data
from server.api.v1 import api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed initial data
    init_db()
    seed_data()
    yield


app = FastAPI(
    title="Parking Locator & Hourly Rates API",
    description="REST & Real-Time WebSocket API for locating open parking spots and checking rates",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(api_v1_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "parking-locator-api"}


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Parking Locator & Hourly Rates API",
        "docs_url": "/docs",
        "health_url": "/health",
    }
