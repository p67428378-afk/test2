
from fastapi import FastAPI
from server.api.v1.api import api_router
from server.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(api_router, prefix="/api/v1")
