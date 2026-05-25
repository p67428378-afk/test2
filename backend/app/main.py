from fastapi import FastAPI
from app.api.v1.endpoints import interest_certificate
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(interest_certificate.router, prefix="/api/v1/interest-certificate", tags=["interest-certificate"])
