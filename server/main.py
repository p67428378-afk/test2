from fastapi import FastAPI
from contextlib import asynccontextmanager
from starlette.middleware.cors import CORSMiddleware
import os

from server.api.v1.endpoints import password_reset
from server import router as zoo_router
from server.database import init_db, seed_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and seed data on startup
    init_db()
    seed_data()
    yield


app = FastAPI(lifespan=lifespan)

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

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(zoo_router.router, prefix="/api/v1", tags=["zoo"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Zoo Visitor App API"}
