from fastapi import FastAPI
from backend.app.api.endpoints import credit_card_products
from backend.app.db.database import engine, Base
from backend.app.models import models # Import models to ensure they are registered with SQLAlchemy Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(credit_card_products.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Credit Card Application Portal API"}
