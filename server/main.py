from fastapi import FastAPI
from server.api.v1 import alerts
from server.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Low Balance Alert Service"}
