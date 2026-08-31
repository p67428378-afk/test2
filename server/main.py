import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, SessionLocal, seed_data
from server.api.v1.groups import router as groups_router
from server.api.v1.expenses import router as expenses_router
from server.api.v1.settlements import router as settlements_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield
    # Shutdown


app = FastAPI(
    title="Bill Splitter API",
    description="Backend service for group expense management, split calculation, and debt settlement.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
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

# Include API Routers
app.include_router(groups_router, prefix="/api/v1")
app.include_router(expenses_router, prefix="/api/v1")
app.include_router(settlements_router, prefix="/api/v1")


@app.get("/health", response_model=dict)
def health_check():
    return {"status": "healthy", "service": "bill-splitter-api"}


@app.get("/", response_model=dict)
def root():
    return {
        "message": "Welcome to the Bill Splitter API",
        "docs_url": "/docs",
        "version": "1.0.0",
    }
