from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, auth, accounts, transfers, transactions
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Apex Bank API")

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(auth.router, prefix="/api/v1", tags=["auth"])
app.include_router(accounts.router, prefix="/api/v1", tags=["accounts"])
app.include_router(transfers.router, prefix="/api/v1", tags=["transfers"])
app.include_router(transactions.router, prefix="/api/v1", tags=["transactions"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Apex Bank API"}
