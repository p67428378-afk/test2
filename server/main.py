
from fastapi import FastAPI
from server.app.api.v1.endpoints import orders, positions, market_data, tca
from server.app.db.session import engine
from server.app.db.base import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(positions.router, prefix="/api/v1/positions", tags=["positions"])
app.include_router(market_data.router, prefix="/api/v1/market-data", tags=["market-data"])
app.include_router(tca.router, prefix="/api/v1/tca", tags=["tca"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Money Management System API"}

