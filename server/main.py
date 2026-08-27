from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, campaigns, donations


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema & seed data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware setup
ALLOWED_ORIGINS = [
    origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",") if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(campaigns.router, prefix=settings.API_V1_STR)
app.include_router(donations.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Donation Management Portal API",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
