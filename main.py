from fastapi import FastAPI
from app.database import engine, Base
from app.api.endpoints import policies

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(policies.router, prefix="/api")
