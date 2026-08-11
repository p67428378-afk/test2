from fastapi import FastAPI
from app.database import engine, Base
from app.routers import premium_calculator

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Vehicle Insurance Premium Calculator API",
    description="API for calculating vehicle insurance premiums with tiered NCB and vehicle multipliers.",
    version="1.0.0",
)

app.include_router(premium_calculator.router)
