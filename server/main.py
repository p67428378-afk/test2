
from fastapi import FastAPI
from server.api.v1 import recharge
from server.database import engine, Base

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Prepaid Recharge Microservice",
    description="A microservice for handling mobile and DTH recharges.",
    version="1.0.0"
)

app.include_router(recharge.router, prefix="/api/v1/recharge", tags=["recharge"])

@app.get("/")
def read_root():
    return {"status": "ok"}

