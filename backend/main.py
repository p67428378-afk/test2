
from fastapi import FastAPI
from backend.routers import card

app = FastAPI(title="Instant Debit Card Blocking Microservice")

app.include_router(card.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Instant Debit Card Blocking Microservice"}
