from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routers.visitor import router as visitor_router
from server.routers.inmate import router as inmate_router
from server.routers.appointment import router as appointment_router
from server.routers.verification import router as verification_router
from server.routers.entry_exit_log import router as entry_exit_log_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize schema
    init_db()
    # Seed default data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(visitor_router, prefix=settings.API_V1_STR)
app.include_router(inmate_router, prefix=settings.API_V1_STR)
app.include_router(appointment_router, prefix=settings.API_V1_STR)
app.include_router(verification_router, prefix=settings.API_V1_STR)
app.include_router(entry_exit_log_router, prefix=settings.API_V1_STR)


@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME}


@app.get("/")
def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
