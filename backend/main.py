
from fastapi import FastAPI
from .database import engine, Base
from .routers import transactions

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(transactions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Real-time UPI Transaction Monitoring Service"}

