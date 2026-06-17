from fastapi import FastAPI
from contextlib import asynccontextmanager
from server.api.v1.endpoints import password_reset, product_strategy
from server.database import Base, engine, SessionLocal
from server import crud


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed data
    db = SessionLocal()
    try:
        crud.seed_data(db)
    finally:
        db.close()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(product_strategy.router, prefix="/api/v1", tags=["product-strategy"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Password Reset Microservice"}
