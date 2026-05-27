
from fastapi import FastAPI
from server.api.v1 import alerts
from server.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Low Balance Alert Service",
    description="A microservice to set up low balance alerts for retail bank customers.",
    version="1.0.0"
)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Low Balance Alert Service"}

app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
