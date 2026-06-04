
from fastapi import FastAPI
from server.api.v1.endpoints import premiums
from server.db.session import engine
from server.models.policy import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(premiums.router, prefix="/api/v1/premiums", tags=["premiums"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Insurance Premium Calculator API"}

