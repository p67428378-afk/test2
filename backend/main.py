from fastapi import FastAPI
from . import certificate_router
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Balance Certificate Generation API",
    description="API for generating balance certificates for retail bank customers.",
    version="1.0.0"
)

app.include_router(certificate_router.router, prefix="/api/v1", tags=["Certificate"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Balance Certificate Generation API"}
