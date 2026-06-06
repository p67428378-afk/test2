from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, assortment
from server.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(assortment.router, prefix="/api/v1", tags=["assortment"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor Application"}
