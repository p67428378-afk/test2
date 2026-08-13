from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Ticket, GateScan
from server.schemas import (
    TicketCreate,
    TicketValidateRequest,
    TicketValidateResponse,
    TicketOut,
)
from server.auth import verify_qr_payload, generate_qr_payload

router = APIRouter(prefix="/api/v1/tickets", tags=["Ticket Validation & Gate Entry"])


@router.post("/validate", response_model=TicketValidateResponse)
def validate_ticket(payload: TicketValidateRequest, db: Session = Depends(get_db)):
    scanned_at = datetime.utcnow()

    # 1. Lookup ticket
    ticket = db.query(Ticket).filter(Ticket.ticket_code == payload.ticket_code).first()
    if not ticket:
        raise HTTPException(
            status_code=400,
            detail={"status": "INVALID", "message": "Invalid Ticket Code"},
        )

    # 2. Verify HMAC Signature if QR payload provided
    if payload.qr_payload:
        valid_signature = verify_qr_payload(payload.ticket_code, payload.qr_payload)
        if not valid_signature:
            # Record failed scan
            scan = GateScan(
                ticket_id=ticket.id,
                gate_name=payload.gate_name,
                scan_result="INVALID_SIGNATURE",
                scanned_at=scanned_at,
            )
            db.add(scan)
            db.commit()
            raise HTTPException(
                status_code=400,
                detail={
                    "status": "INVALID",
                    "message": "Corrupted/Tampered QR Payload Signature",
                },
            )

    # 3. Anti-Passback Check: Prevent Re-Use
    if ticket.is_used:
        # Record duplicate passback scan attempt
        scan = GateScan(
            ticket_id=ticket.id,
            gate_name=payload.gate_name,
            scan_result="DUPLICATE_PASSBACK",
            scanned_at=scanned_at,
        )
        db.add(scan)
        db.commit()

        used_time_str = (
            ticket.used_at.strftime("%H:%M:%S") if ticket.used_at else "earlier"
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "status": "INVALID",
                "message": f"Already Checked In at {used_time_str} (Anti-Passback)",
            },
        )

    # 4. Valid Single-Use Ticket Entry
    ticket.is_used = True
    ticket.used_at = scanned_at

    scan = GateScan(
        ticket_id=ticket.id,
        gate_name=payload.gate_name,
        scan_result="VALID",
        scanned_at=scanned_at,
    )
    db.add(scan)
    db.commit()
    db.refresh(ticket)

    return TicketValidateResponse(
        status="VALID",
        message="Valid Ticket",
        tier=ticket.tier,
        scanned_at=scanned_at,
    )


@router.post("", response_model=TicketOut, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(Ticket).filter(Ticket.ticket_code == payload.ticket_code).first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Ticket code '{payload.ticket_code}' already exists",
        )

    qr_payload = generate_qr_payload(payload.ticket_code, payload.tier)
    ticket = Ticket(
        ticket_code=payload.ticket_code,
        tier=payload.tier,
        qr_payload_hash=qr_payload,
        is_used=False,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return TicketOut(
        id=str(ticket.id),
        ticket_code=ticket.ticket_code,
        tier=ticket.tier,
        is_used=ticket.is_used,
        used_at=ticket.used_at,
        created_at=ticket.created_at,
    )


@router.get("", response_model=List[TicketOut])
def list_tickets(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).all()
    return [
        TicketOut(
            id=str(t.id),
            ticket_code=t.ticket_code,
            tier=t.tier,
            is_used=t.is_used,
            used_at=t.used_at,
            created_at=t.created_at,
        )
        for t in tickets
    ]
