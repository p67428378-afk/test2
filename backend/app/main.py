from fastapi import FastAPI, Depends
from .api import premium_calculator
from .db.database import Base, engine
from .dependencies import get_db

app = FastAPI()

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(premium_calculator.router, prefix="/api", dependencies=[Depends(get_db)])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Vehicle Insurance Premium Calculator"}
