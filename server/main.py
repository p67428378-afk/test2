from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.config import settings
from server.database import init_db, seed_data
from server.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed default accounts
    init_db()
    seed_data()
    yield


app = FastAPI(
    title="EB Maintenance Tracker API",
    description="Backend API for Electricity Board Maintenance Task Tracking, Cost Analytics, and Assignments",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS Middleware
allowed_origins = [
    origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "EB Maintenance Tracker API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
