import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, categories, boxes, reviews


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed test data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Subscription Box Finder API",
    description="Discover monthly box curations, gift box subscriptions, customize curations, and review subscription boxes.",
    version="1.0.0",
    lifespan=lifespan,
)

# Mandatory CORS setup
raw_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [
    origin.strip() for origin in raw_origins.split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins
    if allowed_origins
    else ["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(boxes.router)
app.include_router(reviews.router)


@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "service": "Subscription Box Finder API",
        "version": "1.0.0",
    }


@app.get("/", tags=["health"])
def root():
    return {
        "message": "Welcome to the Subscription Box Finder API",
        "docs_url": "/docs",
        "version": "1.0.0",
    }
