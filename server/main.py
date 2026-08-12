from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

from server.database import init_db, seed_data, SessionLocal
from server.api.v1.endpoints import (
    password_reset,
    auth,
    books,
    members,
    loans,
    fines,
    inventory,
    paintings,
    configurator,
    cart,
    checkout,
    orders,
    admin,
)

# Initialize database tables
init_db()

# Seed initial data
db = SessionLocal()
try:
    seed_data(db)
finally:
    db.close()

app = FastAPI(
    title="E-Commerce Wall Painting & Custom Artwork Platform API",
    version="1.0.0",
    description="Full-stack digital storefront for browsing, configuring, purchasing wall paintings, and order tracking.",
)

# CORS Middleware configuration (MANDATORY for fullstack)
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

# Include Wall Painting routers
app.include_router(paintings.router, prefix="/api/v1", tags=["paintings"])
app.include_router(configurator.router, prefix="/api/v1", tags=["configurator"])
app.include_router(cart.router, prefix="/api/v1", tags=["cart"])
app.include_router(checkout.router, prefix="/api/v1", tags=["checkout"])
app.include_router(orders.router, prefix="/api/v1", tags=["orders"])
app.include_router(admin.router, prefix="/api/v1", tags=["admin"])

# Include existing legacy routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(books.router, prefix="/api/v1", tags=["books"])
app.include_router(members.router, prefix="/api/v1", tags=["members"])
app.include_router(loans.router, prefix="/api/v1", tags=["loans"])
app.include_router(fines.router, prefix="/api/v1", tags=["fines"])
app.include_router(inventory.router, prefix="/api/v1", tags=["inventory"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the E-Commerce Wall Painting & Custom Artwork Platform API",
        "docs_url": "/docs",
    }
