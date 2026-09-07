import hmac
import hashlib
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from server.database import get_db
import server.models as models
import server.schemas as schemas

router = APIRouter(prefix="/api/v1/visitors", tags=["Visitors & QR Validation"])

QR_SECRET_KEY = os.getenv("QR_SECRET_KEY", "qr-secret-key-change-in-production")


def generate_qr_signature(
    visitor_id: str, valid_from: datetime, valid_until: datetime
) -> str:
    """Generate cryptographically signed HMAC token for QR code."""
    payload = f"{visitor_id}:{valid_from.isoformat()}:{valid_until.isoformat()}"
    signature = hmac.new(
        QR_SECRET_KEY.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256
    ).hexdigest()
    return f"QR_{visitor_id}_{signature[:24]}"


def ensure_utc(dt: datetime) -> datetime:
    if dt is None:
        return dt
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


@router.post(
    "/pre-approval",
    response_model=schemas.VisitorPreApprovalResponse,
    status_code=status.HTTP_201_CREATED,
)
@router.post(
    "",
    response_model=schemas.VisitorPreApprovalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_visitor_pre_approval(
    payload: schemas.VisitorPreApprovalCreate, db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    valid_from = ensure_utc(payload.valid_from)
    valid_until = ensure_utc(payload.valid_until)

    if valid_until <= valid_from:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="valid_until must be after valid_from",
        )

    visitor_id = str(uuid.uuid4())
    visitor = models.VisitorPreApproval(
        id=visitor_id,
        unit_number=payload.unit_number,
        visitor_name=payload.visitor_name,
        contact_phone=payload.contact_phone,
        vehicle_number=payload.vehicle_number,
        created_by_user="test@example.com",
        created_at=now,
    )
    db.add(visitor)

    token_sig = generate_qr_signature(visitor_id, valid_from, valid_until)
    token_id = str(uuid.uuid4())
    token = models.QRToken(
        id=token_id,
        visitor_id=visitor_id,
        token_signature=token_sig,
        valid_from=valid_from,
        valid_until=valid_until,
        status="ACTIVE",
    )
    db.add(token)

    db.commit()
    db.refresh(visitor)

    return schemas.VisitorPreApprovalResponse(
        visitor_id=visitor.id,
        id=visitor.id,
        unit_number=visitor.unit_number,
        visitor_name=visitor.visitor_name,
        contact_phone=visitor.contact_phone,
        vehicle_number=visitor.vehicle_number,
        qr_token=token_sig,
        valid_from=valid_from,
        valid_until=valid_until,
        status=token.status,
        created_at=visitor.created_at,
    )


@router.get("/pre-approval", response_model=List[schemas.VisitorPreApprovalResponse])
@router.get("", response_model=List[schemas.VisitorPreApprovalResponse])
def list_visitor_pre_approvals(
    unit_number: Optional[str] = Query(None), db: Session = Depends(get_db)
):
    query = db.query(models.VisitorPreApproval)
    if unit_number:
        query = query.filter(models.VisitorPreApproval.unit_number == unit_number)

    visitors = query.order_by(models.VisitorPreApproval.created_at.desc()).all()

    result = []
    for v in visitors:
        # Get latest QR token for this visitor
        token = (
            db.query(models.QRToken)
            .filter(models.QRToken.visitor_id == v.id)
            .order_by(models.QRToken.valid_from.desc())
            .first()
        )
        qr_str = token.token_signature if token else ""
        valid_from = token.valid_from if token else v.created_at
        valid_until = token.valid_until if token else v.created_at
        token_status = token.status if token else "ACTIVE"

        result.append(
            schemas.VisitorPreApprovalResponse(
                visitor_id=v.id,
                id=v.id,
                unit_number=v.unit_number,
                visitor_name=v.visitor_name,
                contact_phone=v.contact_phone,
                vehicle_number=v.vehicle_number,
                qr_token=qr_str,
                valid_from=ensure_utc(valid_from),
                valid_until=ensure_utc(valid_until),
                status=token_status,
                created_at=ensure_utc(v.created_at),
            )
        )

    return result


@router.post("/qr/validate", response_model=schemas.QRValidateResponse)
def validate_qr_entry(
    payload: schemas.QRValidateRequest, db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)

    token = (
        db.query(models.QRToken)
        .filter(models.QRToken.token_signature == payload.qr_token)
        .first()
    )

    if not token:
        return schemas.QRValidateResponse(
            access_granted=False,
            error_code="TOKEN_NOT_FOUND",
            detail="QR token not found or invalid",
            message="Access Denied - Invalid Token",
        )

    visitor = (
        db.query(models.VisitorPreApproval)
        .filter(models.VisitorPreApproval.id == token.visitor_id)
        .first()
    )

    if token.status != "ACTIVE":
        return schemas.QRValidateResponse(
            access_granted=False,
            visitor_name=visitor.visitor_name if visitor else None,
            unit_number=visitor.unit_number if visitor else None,
            error_code="TOKEN_EXPIRED_OR_USED",
            detail=f"QR token status is {token.status}. Previous used at: {token.used_at}",
            message="Access Denied - Token Previously Used or Revoked",
        )

    valid_from = ensure_utc(token.valid_from)
    valid_until = ensure_utc(token.valid_until)

    if now < valid_from or now > valid_until:
        if now > valid_until:
            token.status = "EXPIRED"
            db.commit()

        return schemas.QRValidateResponse(
            access_granted=False,
            visitor_name=visitor.visitor_name if visitor else None,
            unit_number=visitor.unit_number if visitor else None,
            error_code="TOKEN_OUTSIDE_VALIDITY_WINDOW",
            detail=f"Current time ({now.isoformat()}) is outside validity window ({valid_from.isoformat()} to {valid_until.isoformat()})",
            message="Access Denied - Token Outside Validity Window",
        )

    # Valid token -> Update state to USED
    token.status = "USED"
    token.used_at = now
    token.used_at_gate = payload.gate_id
    db.commit()

    return schemas.QRValidateResponse(
        access_granted=True,
        visitor_name=visitor.visitor_name if visitor else "Unknown Visitor",
        unit_number=visitor.unit_number if visitor else "Unknown Unit",
        entry_timestamp=now,
        message="Access Granted - Valid Single-Use Token",
    )
