
from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routers import policies

app = FastAPI()

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(policies.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Health Insurance Policy Management API"}
