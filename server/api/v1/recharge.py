
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, services
from server.database import get_db
from uuid import UUID

router = APIRouter()

@router.get("/operators", response_model=schemas.OperatorResponse)
def get_operators(accountNumber: str, serviceType: str):
    return services.get_operators(accountNumber, serviceType)

@router.post("/initiate", response_model=schemas.InitiateRechargeResponse, status_code=201)
def initiate_recharge(request: schemas.InitiateRechargeRequest, db: Session = Depends(get_db)):
    try:
        return services.initiate_recharge(db, request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/confirm", response_model=schemas.ConfirmRechargeResponse)
def confirm_recharge(request: schemas.ConfirmRechargeRequest, db: Session = Depends(get_db)):
    try:
        return services.confirm_recharge(db, request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except ConnectionAbortedError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{transaction_id}", response_model=schemas.RechargeStatusResponse)
def get_recharge_status(transaction_id: UUID, db: Session = Depends(get_db)):
    try:
        return services.get_recharge_status(db, transaction_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
