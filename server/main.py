import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data
from server.api.v1.endpoints.categories import router as categories_router
from server.api.v1.endpoints.parking_spots import router as parking_spots_router
from server.api.v1.endpoints.realtime import router as realtime_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema and seed initial data
    init_db()
    seed_data()
    yield


app = FastAPI(
    title="Vehicle Category & Parking Management API",
    description="RESTful API for Vehicle Categories (Car, Bike) and Parking Management.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
raw_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(categories_router, prefix="/api/v1")
app.include_router(parking_spots_router, prefix="/api/v1")
app.include_router(realtime_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "vehicle-category-parking-api",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
