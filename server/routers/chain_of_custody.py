import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.database import get_db
from server.models import User, EvidenceItem, ChainOfCustodyEntry
from server.schemas import (
    ChainOfCustodyTransferRequest,
    ChainOfCustodyActionRequest,
    ChainOfCustodyEntryResponse,
    ChainOfCustodyHistoryResponse,
    UserResponse,
)
from server.auth import get_current_user
from server.rbac import (
    require_roles,
    ROLE_ADMIN,
    ROLE_LEAD_INVESTIGATOR,
    ROLE_INVESTIGATOR,
    ROLE_PROSECUTOR,
)
from server.audit import log_audit_event

router = APIRouter(prefix="/api/v1/chain-of-custody", tags=["Chain of Custody"])


def format_coc_entry(entry: ChainOfCustodyEntry) -> ChainOfCustodyEntryResponse:
    prev_user = None
    if entry.previous_custodian:
        prev_user = UserResponse.model_validate(entry.previous_custodian)
    new_user = UserResponse.model_validate(entry.new_custodian)

    return ChainOfCustodyEntryResponse(
        id=entry.id,
        evidence_id=entry.evidence_id,
        previous_custodian_id=entry.previous_custodian_id,
        previous_custodian=prev_user,
        new_custodian_id=entry.new_custodian_id,
        new_custodian=new_user,
        action=entry.action,
        transfer_reason=entry.transfer_reason,
        location_context=entry.location_context,
        timestamp=entry.timestamp,
    )


@router.post(
    "/transfer",
    response_model=ChainOfCustodyEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def transfer_custody(
    transfer_in: ChainOfCustodyTransferRequest,
    request: Request,
    current_user: User = Depends(
        require_roles(
            [ROLE_ADMIN, ROLE_LEAD_INVESTIGATOR, ROLE_INVESTIGATOR, ROLE_PROSECUTOR]
        )
    ),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    evidence = (
        db.query(EvidenceItem)
        .filter(
            or_(
                EvidenceItem.id == transfer_in.evidence_id,
                EvidenceItem.evidence_code == transfer_in.evidence_id,
            )
        )
        .first()
    )
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence item '{transfer_in.evidence_id}' not found",
        )

    new_custodian = (
        db.query(User).filter(User.id == transfer_in.new_custodian_id).first()
    )
    if not new_custodian:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"New custodian user ID '{transfer_in.new_custodian_id}' not found",
        )

    previous_custodian_id = evidence.current_custodian_id

    # Create immutable chain of custody record
    coc_entry = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id=evidence.id,
        previous_custodian_id=previous_custodian_id,
        new_custodian_id=new_custodian.id,
        action="TRANSFER",
        transfer_reason=transfer_in.transfer_reason,
        location_context=transfer_in.location_context,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(coc_entry)

    # Update evidence current custodian
    evidence.current_custodian_id = new_custodian.id
    evidence.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(coc_entry)

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="TRANSFER_SIGN_OFF",
        resource=f"/evidence/{evidence.id}",
        status_code=201,
        ip_address=client_ip,
        details={
            "evidence_code": evidence.evidence_code,
            "previous_custodian_id": previous_custodian_id,
            "new_custodian_id": new_custodian.id,
            "new_custodian_email": new_custodian.email,
            "transfer_reason": transfer_in.transfer_reason,
        },
    )

    return format_coc_entry(coc_entry)


@router.post(
    "/action",
    response_model=ChainOfCustodyEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
def record_custody_action(
    action_in: ChainOfCustodyActionRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    evidence = (
        db.query(EvidenceItem)
        .filter(
            or_(
                EvidenceItem.id == action_in.evidence_id,
                EvidenceItem.evidence_code == action_in.evidence_id,
            )
        )
        .first()
    )
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence item '{action_in.evidence_id}' not found",
        )

    coc_entry = ChainOfCustodyEntry(
        id=str(uuid.uuid4()),
        evidence_id=evidence.id,
        previous_custodian_id=evidence.current_custodian_id,
        new_custodian_id=current_user.id,
        action=action_in.action.upper(),
        transfer_reason=action_in.reason,
        location_context=action_in.location_context,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(coc_entry)
    db.commit()
    db.refresh(coc_entry)

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action=f"CUSTODY_{action_in.action.upper()}",
        resource=f"/evidence/{evidence.id}",
        status_code=201,
        ip_address=client_ip,
        details={"evidence_code": evidence.evidence_code, "reason": action_in.reason},
    )

    return format_coc_entry(coc_entry)


@router.get("/{evidence_id}", response_model=ChainOfCustodyHistoryResponse)
def get_chain_of_custody(
    evidence_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "127.0.0.1"

    evidence = (
        db.query(EvidenceItem)
        .filter(
            or_(
                EvidenceItem.id == evidence_id,
                EvidenceItem.evidence_code == evidence_id,
            )
        )
        .first()
    )
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Evidence item '{evidence_id}' not found",
        )

    entries = (
        db.query(ChainOfCustodyEntry)
        .filter(ChainOfCustodyEntry.evidence_id == evidence.id)
        .order_by(ChainOfCustodyEntry.timestamp.asc())
        .all()
    )

    log_audit_event(
        db=db,
        user_id=current_user.id,
        user_email=current_user.email,
        action="CHAIN_OF_CUSTODY_VIEW",
        resource=f"/evidence/{evidence.id}/chain-of-custody",
        status_code=200,
        ip_address=client_ip,
        details={
            "evidence_code": evidence.evidence_code,
            "total_entries": len(entries),
        },
    )

    return ChainOfCustodyHistoryResponse(
        evidence_id=evidence.id,
        evidence_code=evidence.evidence_code,
        total_entries=len(entries),
        history=[format_coc_entry(e) for e in entries],
    )
