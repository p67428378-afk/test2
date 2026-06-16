from fastapi import FastAPI
from .routers import auth, accounts, transactions, transfers

app = FastAPI()

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["accounts"])
app.include_router(transactions.router, prefix="/api/v1/accounts", tags=["transactions"])
app.include_router(transfers.router, prefix="/api/v1/transfers", tags=["transfers"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Banking API"}
