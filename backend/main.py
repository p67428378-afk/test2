from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models
from .database import engine, get_db
from .routers import premium

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vehicle Insurance Premium Calculator API",
    description="API for calculating vehicle insurance premiums with NCB and Vehicle Multipliers.",
    version="1.0.0",
)

app.include_router(premium.router, prefix="/api/v1/insurance", tags=["insurance"])

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Vehicle Insurance Premium Calculator API"}
