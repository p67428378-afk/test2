from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routers import auth, learning, progress


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    init_db()
    # Seed initial data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Interactive Alphabet & Numbers Learning API",
    description="API for kids learning alphabets and numbers",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(learning.router)
app.include_router(progress.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Interactive Alphabet & Numbers Learning API!"}
