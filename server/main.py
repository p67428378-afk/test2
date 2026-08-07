import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from server.database import init_db, seed_data, SessionLocal
from server.api.v1.endpoints import sellers, products

# Initialize database tables
init_db()

# Seed initial data
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(title="Laptop Seller Portal & Catalog Management API", version="1.0.0")

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

# Include routers
app.include_router(sellers.router, prefix="/api/v1/sellers", tags=["sellers"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Laptop Seller Portal & Catalog Management API"}
