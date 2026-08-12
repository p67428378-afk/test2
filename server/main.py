import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.api.v1.endpoints import auth, orders, payments, pickups, routes
from server.database import SessionLocal, init_db, seed_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    # Seed initial test data
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Laundry Management Platform API",
    version="1.0.0",
    lifespan=lifespan,
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

# Include API Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(pickups.router, prefix="/api/v1/pickups", tags=["pickups"])
app.include_router(routes.router, prefix="/api/v1/routes", tags=["routes"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Laundry Management Platform API"}
