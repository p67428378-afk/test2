from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

from .database import engine, Base
from .router import router
from .api.v1.endpoints.password_reset import router as password_reset_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DG Cluster Assortment Advisor API",
    description="Decision-support tool for Dollar General category managers to optimize Snacks product assortments.",
    version="1.0.0",
)

# CORS Middleware configuration
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

# Include API routers
app.include_router(router)
app.include_router(password_reset_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
