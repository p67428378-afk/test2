import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import SessionLocal, init_db, seed_data
from server.routers import feedback, preferences, products, recommendations


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    init_db()
    # Seed default catalog data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Product Recommendation System API",
    description="API for browsing products, submitting user preferences, and AI-driven recommendations.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(products.router)
app.include_router(preferences.router)
app.include_router(recommendations.router)
app.include_router(feedback.router)


@app.get("/health", tags=["health"])
@app.get("/api/v1/health", tags=["health"])
def health_check():
    return {
        "status": "healthy",
        "service": "recommendation-service",
        "version": "1.0.0",
    }
