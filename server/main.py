
from fastapi import FastAPI
from .api.v1.endpoints import accounts, transactions
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["accounts"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["transactions"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bank Management System API"}
