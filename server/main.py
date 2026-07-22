from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset, assortment
from server.database import init_db, seed_data, SessionLocal
import os

# Initialize database schema
init_db()

# Seed data on startup
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(title="DG Cluster Assortment Advisor API")

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
app.include_router(assortment.router, prefix="/api/v1/assortment", tags=["assortment"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}
