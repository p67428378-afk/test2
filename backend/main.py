
from fastapi import FastAPI
from .database import engine
from . import models
from .routers import premium

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(premium.router, prefix="/api/v1/insurance", tags=["premium"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Insurance Premium Calculator API"}

