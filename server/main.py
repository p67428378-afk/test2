import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.routers import groups, expenses, settlements


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
    title="Shared Bill Splitter API",
    description="API for managing group expenses, calculating individual shares, tracking net balances, and recording settlements.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS Middleware
raw_allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
)
allowed_origins = [origin.strip() for origin in raw_allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(groups.router)
app.include_router(expenses.router)
app.include_router(settlements.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "healthy",
        "service": "Shared Bill Splitter API",
        "version": "1.0.0",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
