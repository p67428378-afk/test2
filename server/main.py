from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from server.config import settings
from server.database import init_db, seed_data, SessionLocal
from server.routes import paintings, cart, orders, webhooks


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database and seed data
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Online Wall Painting Marketplace API", version="1.0.0", lifespan=lifespan
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
app.include_router(paintings.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(webhooks.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Online Wall Painting Marketplace API"}
