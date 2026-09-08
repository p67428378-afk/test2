import os
import hmac
import hashlib
import json
import base64
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Visitor, QRToken, User, ParkingAllocation, RecurringPass
from server.schemas import (
    VisitorPreApprovalCreate,
    VisitorPreApprovalResponse,
    QRValidateRequest,
    QRValidateResponse,
    ExtendStayRequest,
    ExtendStayResponse,
)

router = APIRouter(prefix="/api/v1/visitors", tags=["visitors"])

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")


def generate_qr_payload(
    token_id: str, valid_from: datetime, valid_until: datetime
) -> str:
    from_iso = valid_from.isoformat()
    until_iso = valid_until.isoformat()
    raw_str = f"{token_id}:{from_iso}:{until_iso}"
    signature = hmac.new(
        SECRET_KEY.encode("utf-8"), raw_str.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    payload_dict = {
        "token_id": token_id,
        "valid_from": from_iso,
        "valid_until": until_iso,
        "sig": signature,
    }
    encoded = base64.b64encode(json.dumps(payload_dict).encode("utf-8")).decode("utf-8")
    return encoded


def verify_qr_payload(payload_str: str) -> dict:
    decoded_bytes = base64.b64decode(payload_str)
    payload_dict = json.loads(decoded_bytes.decode("utf-8"))
    token_id = payload_dict["token_id"]
    valid_from_iso = payload_dict["valid_from"]
    valid_until_iso = payload_dict["valid_until"]
    sig = payload_dict["sig"]

    raw_str = f"{token_id}:{valid_from_iso}:{valid_until_iso}"
    expected_sig = hmac.new(
        SECRET_KEY.encode("utf-8"), raw_str.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(sig, expected_sig):
        raise ValueError("Signature mismatch")
    return payload_dict


@router.post(
    "/pre-approval",
    response_model=VisitorPreApprovalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_pre_approval(data: VisitorPreApprovalCreate, db: Session = Depends(get_db)):
    valid_from = data.valid_from or data.expected_arrival or datetime.utcnow()
    valid_until = (
        data.valid_until or data.expected_departure or (valid_from + timedelta(hours=4))
    )

    # Reject if valid_until is not after valid_from
    if valid_until <= valid_from:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="valid_until must be after valid_from",
        )

    # Retrieve default resident or first user
    resident = db.query(User).filter(User.unit_number == data.unit_number).first()
    if not resident:
        resident = db.query(User).filter(User.role == "resident").first()
    if not resident:
        resident = db.query(User).first()
    resident_id = resident.id if resident else "default-resident-id"

    # Create visitor
    visitor = Visitor(
        resident_id=resident_id,
        unit_number=data.unit_number,
        visitor_name=data.visitor_name,
        phone_number=data.contact_phone or data.phone_number or "",
        vehicle_number=data.vehicle_number,
        assigned_parking_slot=data.assigned_parking_slot,
        expected_arrival=valid_from,
        expected_departure=valid_until,
    )
    db.add(visitor)
    db.commit()
    db.refresh(visitor)

    # Generate QR Token
    qr_token = QRToken(
        visitor_id=visitor.id,
        token_signature="pending",
        valid_from=valid_from,
        valid_until=valid_until,
        is_used=False,
        is_recurring=False,
    )
    db.add(qr_token)
    db.commit()
    db.refresh(qr_token)

    # Create payload signed with token ID
    payload_str = generate_qr_payload(qr_token.id, valid_from, valid_until)
    qr_token.token_signature = payload_str
    db.commit()
    db.refresh(visitor)

    return VisitorPreApprovalResponse.model_validate(visitor)


@router.get("/pre-approval", response_model=List[VisitorPreApprovalResponse])
def list_visitor_pre_approvals(
    unit_number: Optional[str] = None, db: Session = Depends(get_db)
):
    query = db.query(Visitor)
    if unit_number:
        query = query.filter(Visitor.unit_number == unit_number)
    visitors = query.order_by(Visitor.created_at.desc()).all()

    return [VisitorPreApprovalResponse.model_validate(v) for v in visitors]


@router.post("/qr/validate", response_model=QRValidateResponse)
def validate_qr_code(data: QRValidateRequest, db: Session = Depends(get_db)):
    token_str = data.qr_token or data.qr_code_payload or ""
    now = datetime.utcnow()

    default_response = QRValidateResponse(
        access_granted=False,
        status="INVALID",
        visitor_name="Unknown",
        resident_unit="Unknown",
        entry_timestamp=now,
        assigned_parking_slot=None,
    )

    token_id = None
    try:
        payload_dict = verify_qr_payload(token_str)
        token_id = payload_dict.get("token_id")
    except Exception:
        token_id = None

    qr_token = None
    if token_id:
        qr_token = db.query(QRToken).filter(QRToken.id == token_id).first()
    if not qr_token:
        qr_token = (
            db.query(QRToken).filter(QRToken.token_signature == token_str).first()
        )

    if not qr_token:
        return default_response

    # Check recurring pass if applicable
    if qr_token.recurring_pass_id:
        pass_rec = (
            db.query(RecurringPass)
            .filter(RecurringPass.id == qr_token.recurring_pass_id)
            .first()
        )
        if (
            not pass_rec
            or not pass_rec.is_active
            or now < pass_rec.start_date
            or now > pass_rec.end_date
        ):
            return default_response

    # Check single-use
    if not qr_token.is_recurring and qr_token.is_used:
        return default_response

    # Check validity window
    if now < (qr_token.valid_from - timedelta(minutes=5)) or now > (
        qr_token.valid_until + timedelta(minutes=5)
    ):
        return default_response

    # Mark token used & set entry timestamp
    qr_token.is_used = True
    qr_token.entry_timestamp = now
    db.commit()

    visitor_name = "Visitor"
    resident_unit = "Unit 4B"
    assigned_slot = None

    if qr_token.visitor:
        visitor_name = qr_token.visitor.visitor_name
        assigned_slot = qr_token.visitor.assigned_parking_slot
        if qr_token.visitor.unit_number:
            resident_unit = qr_token.visitor.unit_number
        elif qr_token.visitor.resident and qr_token.visitor.resident.unit_number:
            resident_unit = qr_token.visitor.resident.unit_number

        if qr_token.visitor.vehicle_number or qr_token.visitor.assigned_parking_slot:
            allocation = (
                db.query(ParkingAllocation)
                .filter(ParkingAllocation.visitor_id == qr_token.visitor.id)
                .first()
            )
            if not allocation:
                allocation = ParkingAllocation(
                    visitor_id=qr_token.visitor.id,
                    vehicle_number=qr_token.visitor.vehicle_number or "N/A",
                    slot_number=qr_token.visitor.assigned_parking_slot or "P-01",
                    entry_time=now,
                    expected_exit_time=qr_token.visitor.expected_departure,
                    overstay_flag=False,
                )
                db.add(allocation)
                db.commit()
    elif qr_token.recurring_pass:
        visitor_name = qr_token.recurring_pass.visitor_name
        if (
            qr_token.recurring_pass.resident
            and qr_token.recurring_pass.resident.unit_number
        ):
            resident_unit = qr_token.recurring_pass.resident.unit_number

    return QRValidateResponse(
        access_granted=True,
        status="VALID",
        visitor_name=visitor_name,
        resident_unit=resident_unit,
        entry_timestamp=now,
        assigned_parking_slot=assigned_slot,
    )


@router.post("/{id}/extend-stay", response_model=ExtendStayResponse)
def extend_visitor_stay(
    id: str, data: ExtendStayRequest, db: Session = Depends(get_db)
):
    visitor = db.query(Visitor).filter(Visitor.id == id).first()
    if not visitor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Visitor record not found"
        )

    extension = timedelta(minutes=data.extension_minutes)
    visitor.expected_departure = visitor.expected_departure + extension
    db.commit()

    for token in visitor.qr_tokens:
        token.valid_until = token.valid_until + extension
    for allocation in visitor.parking_allocations:
        allocation.expected_exit_time = allocation.expected_exit_time + extension
    db.commit()

    return ExtendStayResponse(
        visitor_id=visitor.id,
        new_expected_departure=visitor.expected_departure,
    )


@router.get("", response_model=List[dict])
def list_visitors(db: Session = Depends(get_db)):
    visitors = db.query(Visitor).all()
    results = []
    for v in visitors:
        results.append(
            {
                "id": v.id,
                "unit_number": v.unit_number,
                "visitor_name": v.visitor_name,
                "phone_number": v.phone_number,
                "vehicle_number": v.vehicle_number,
                "assigned_parking_slot": v.assigned_parking_slot,
                "expected_arrival": v.expected_arrival.isoformat()
                if v.expected_arrival
                else None,
                "expected_departure": v.expected_departure.isoformat()
                if v.expected_departure
                else None,
                "created_at": v.created_at.isoformat() if v.created_at else None,
            }
        )
    return results
