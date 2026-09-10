import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.database import init_db, seed_data, SessionLocal
from server.routers import categories, places, reviews


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup DB initialization and seed
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Kerala Tourism Web Application API",
    description="RESTful API services for Kerala tourist destinations, categories, reviews, and interactive maps.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
allowed_origins_env = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [
    origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(categories.router)
app.include_router(places.router)
app.include_router(reviews.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Kerala Tourism API",
        "docs_url": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Kerala Tourism API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
