
from fastapi import FastAPI
from .database import engine
from . import models
from .api import credit_cards, applications

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(credit_cards.router, prefix="/api/credit-cards", tags=["credit-cards"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Credit Card Application Platform"}
