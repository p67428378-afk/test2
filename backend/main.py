from fastapi import FastAPI

from .database import engine, SessionLocal, create_db_and_tables
from .models import Product
from .api.endpoints import cart

app = FastAPI()

app.include_router(cart.router, prefix="/api/cart", tags=["cart"])

@app.on_event("startup")
def startup_event():
    create_db_and_tables()
