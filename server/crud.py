
from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID

def create_recharge_request(db: Session, request: schemas.InitiateRechargeRequest) -> models.RechargeRequest:
    db_recharge_request = models.RechargeRequest(
        user_id=request.user_id,
        account_number=request.account_number,
        operator=request.operator_id, # In a real app, you'd look up the operator name from the ID
        amount=request.amount,
        service_type=request.service_type
    )
    db.add(db_recharge_request)
    db.commit()
    db.refresh(db_recharge_request)
    return db_recharge_request

def get_recharge_request(db: Session, request_id: UUID) -> models.RechargeRequest:
    return db.query(models.RechargeRequest).filter(models.RechargeRequest.request_id == request_id).first()

def update_recharge_request_status(db: Session, request_id: UUID, status: str, bank_transaction_id: str = None, operator_reference: str = None) -> models.RechargeRequest:
    db_recharge_request = get_recharge_request(db, request_id)
    if db_recharge_request:
        db_recharge_request.status = status
        if bank_transaction_id:
            db_recharge_request.bank_transaction_id = bank_transaction_id
        if operator_reference:
            db_recharge_request.operator_reference = operator_reference
        db.commit()
        db.refresh(db_recharge_request)
    return db_recharge_request

def create_transaction_log(db: Session, request_id: UUID, event_type: str, details: dict):
    db_log = models.TransactionLog(
        request_id=request_id,
        event_type=event_type,
        details=details
    )
    db.add(db_log)
    db.commit()

def get_configuration(db: Session, key: str) -> models.Configuration:
    return db.query(models.Configuration).filter(models.Configuration.key == key).first()
