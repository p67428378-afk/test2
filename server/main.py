"""Main FastAPI application entrypoint."""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import SessionLocal, init_db, seed_data
from server.routers import feedback, preferences, products, recommendations, saved_items


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifespan events."""
    # Initialize database tables and seed sample data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Product Recommendation System API",
    description="RESTful API for product browsing, preference capturing, AI recommendations, feedback, and saved items.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware Configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check():
    """Service health check endpoint."""
    return {"status": "healthy", "service": "recommendation-system-api"}


# Register Routers
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(
    preferences.router, prefix="/api/v1/preferences", tags=["preferences"]
)
app.include_router(
    recommendations.router, prefix="/api/v1/recommendations", tags=["recommendations"]
)
app.include_router(feedback.router, prefix="/api/v1/recommendations", tags=["feedback"])
app.include_router(
    saved_items.router, prefix="/api/v1/recommendations", tags=["saved_items"]
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
