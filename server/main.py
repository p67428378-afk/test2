from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, quotes, favorites


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Quote Generator API",
    description="API for quote discovery and favorites management",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
ALLOWED_ORIGINS = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(quotes.router)
app.include_router(favorites.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Quote Generator API"}
