from fastapi import FastAPI
from . import models
from .database import engine
from .api.v1 import endpoints

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Health Insurance Policy Management API"}
