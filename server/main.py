from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, plots, plot_types


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
    title="Cemetery Management System API",
    description="API for managing burial plots, plot types, and administrator authentication.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(plots.router, prefix="/api/v1", tags=["Burial Plots"])
app.include_router(plot_types.router, prefix="/api/v1", tags=["Plot Types"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Cemetery Management System API"}
