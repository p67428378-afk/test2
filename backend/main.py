from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas
from .database import SessionLocal, engine, get_db
from .routers import overdraft_protection

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(overdraft_protection.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Automated Overdraft Protection API"}
