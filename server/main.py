from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from server.database import engine
from server.models import Base
from server.routes import books, cart, orders
from server.api.v1.endpoints import password_reset

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hogwarts Library API", version="1.0.0")

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
app.include_router(books.router, prefix="/api/v1", tags=["books"])
app.include_router(cart.router, prefix="/api/v1", tags=["cart"])
app.include_router(orders.router, prefix="/api/v1", tags=["orders"])
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Hogwarts Library API"}
