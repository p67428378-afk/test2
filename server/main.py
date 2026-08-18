from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from server.core.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.api.v1.endpoints import auth, recipes, categories, favorites


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB and seed data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Recipe Manager API",
    description="API for managing cooking recipes, categories, and favorites.",
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
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["Recipes"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(favorites.router, prefix="/api/v1/users", tags=["Favorites"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Recipe Manager API"}
