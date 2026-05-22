from fastapi import FastAPI
from server.api.v1.endpoints import topup
from server.database import engine
from server.models import topup_application

topup_application.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(topup.router, prefix="/api/v1", tags=["topup"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Home Loan Top-Up Application API"}
