import os
import hmac
import hashlib
import json
import base64
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import RecurringPass, QRToken, User
from server.schemas import (
    RecurringPassCreate,
    RecurringPassResponse,
    RecurringPassRevokeResponse,
)

router = APIRouter(prefix="/api/v1/visitors/recurring", tags=["recurring-passes"])

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")


def generate_recurring_qr_payload(token_id: str, pass_id: str) -> str:
    raw_str = f"recurring:{token_id}:{pass_id}"
    signature = hmac.new(
        SECRET_KEY.encode("utf-8"), raw_str.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    payload_dict = {
        "token_id": token_id,
        "pass_id": pass_id,
        "type": "recurring",
        "sig": signature,
    }
    encoded = base64.b64encode(json.dumps(payload_dict).encode("utf-8")).decode("utf-8")
    return encoded


@router.post(
    "", response_model=RecurringPassResponse, status_code=status.HTTP_201_CREATED
)
def create_recurring_pass(data: RecurringPassCreate, db: Session = Depends(get_db)):
    resident = db.query(User).filter(User.role == "resident").first()
    resident_id = resident.id if resident else "default-resident-id"

    pass_record = RecurringPass(
        resident_id=resident_id,
        visitor_name=data.visitor_name,
        service_type=data.service_type,
        days_of_week=data.days_of_week,
        start_date=data.start_date,
        end_date=data.end_date,
        access_start_time=data.access_start_time,
        access_end_time=data.access_end_time,
        is_active=True,
    )
    db.add(pass_record)
    db.commit()
    db.refresh(pass_record)

    # Generate linked QR Token for recurring pass
    qr_token = QRToken(
        recurring_pass_id=pass_record.id,
        token_signature="pending",
        valid_from=data.start_date,
        valid_until=data.end_date,
        is_used=False,
        is_recurring=True,
    )
    db.add(qr_token)
    db.commit()
    db.refresh(qr_token)

    payload_str = generate_recurring_qr_payload(qr_token.id, pass_record.id)
    qr_token.token_signature = payload_str
    db.commit()

    return RecurringPassResponse.model_validate(pass_record)


@router.delete("/{id}", response_model=RecurringPassRevokeResponse)
def revoke_recurring_pass(id: str, db: Session = Depends(get_db)):
    pass_record = db.query(RecurringPass).filter(RecurringPass.id == id).first()
    if not pass_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recurring pass not found"
        )

    pass_record.is_active = False

    tokens = db.query(QRToken).filter(QRToken.recurring_pass_id == id).all()
    now = datetime.utcnow()
    for token in tokens:
        token.is_used = True
        token.valid_until = now
    db.commit()

    return RecurringPassRevokeResponse(
        recurring_pass_id=pass_record.id,
        is_active=False,
        message="Pass revoked and all associated tokens invalidated immediately.",
    )


@router.get("", response_model=List[RecurringPassResponse])
def list_recurring_passes(db: Session = Depends(get_db)):
    passes = db.query(RecurringPass).all()
    return [RecurringPassResponse.model_validate(p) for p in passes]
