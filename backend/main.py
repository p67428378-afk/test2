
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, services
from .database import SessionLocal, engine, get_db
import uuid

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/kyc/", response_model=schemas.KYCRequest)
def create_kyc_request(request: schemas.KYCRequestCreate, db: Session = Depends(get_db)):
    return services.create_kyc_request(db=db, request=request)

@app.get("/kyc/{request_id}", response_model=schemas.KYCRequest)
def get_kyc_request(request_id: uuid.UUID, db: Session = Depends(get_db)):
    db_request = services.get_kyc_request(db, request_id=request_id)
    if db_request is None:
        raise HTTPException(status_code=404, detail="KYC request not found")
    return db_request

@app.post("/kyc/{request_id}/validate")
def validate_kyc_request(request_id: uuid.UUID, db: Session = Depends(get_db)):
    return services.validate_kyc_documents(db, request_id)
