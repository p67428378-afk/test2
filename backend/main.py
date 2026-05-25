from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal, engine, get_db
from .routers import applicants, applications

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(applicants.router)
app.include_router(applications.router)

@app.get("/", response_model=str)
def read_root():
    return "Welcome to the Credit Card Application API!"
