import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routers import sessions, players, scores

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables and seed initial data
    logger.info("Initializing database...")
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown
    logger.info("Application shutdown complete.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="RESTful API for the Board Game Scorer application",
    version="1.0.0",
    lifespan=lifespan,
)

# Mandatory CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(sessions.router, prefix=settings.API_V1_STR)
app.include_router(players.router, prefix=settings.API_V1_STR)
app.include_router(scores.router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "app": settings.PROJECT_NAME, "version": "1.0.0"}
