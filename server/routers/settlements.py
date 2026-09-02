from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Group, GroupMember, SettlementTransaction
from server.schemas import SettlementCreate, SettlementResponse

router = APIRouter(tags=["Settlements"])


@router.post("/api/v1/settlements", response_model=SettlementResponse, status_code=status.HTTP_201_CREATED)
def record_settlement(settlement_in: SettlementCreate, db: Session = Depends(get_db)):
    """Record a direct settlement payment between group members."""
    if settlement_in.payer_id == settlement_in.payee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payer and Payee cannot be the same group member.",
        )

    # 1. Verify group exists
    group = db.query(Group).filter(Group.id == settlement_in.group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID '{settlement_in.group_id}' not found.",
        )

    # 2. Verify payer and payee belong to the group
    payer = (
        db.query(GroupMember)
        .filter(
            GroupMember.id == settlement_in.payer_id,
            GroupMember.group_id == settlement_in.group_id,
        )
        .first()
    )
    if not payer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payer '{settlement_in.payer_id}' is not a valid member of group '{settlement_in.group_id}'.",
        )

    payee = (
        db.query(GroupMember)
        .filter(
            GroupMember.id == settlement_in.payee_id,
            GroupMember.group_id == settlement_in.group_id,
        )
        .first()
    )
    if not payee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payee '{settlement_in.payee_id}' is not a valid member of group '{settlement_in.group_id}'.",
        )

    # 3. Create settlement record
    settlement = SettlementTransaction(
        group_id=settlement_in.group_id,
        payer_id=settlement_in.payer_id,
        payee_id=settlement_in.payee_id,
        amount=round(settlement_in.amount, 2),
        date=settlement_in.date,
        notes=settlement_in.notes,
    )
    db.add(settlement)
    db.commit()
    db.refresh(settlement)
    return settlement


@router.get("/api/v1/groups/{group_id}/settlements", response_model=List[SettlementResponse])
def list_group_settlements(
    group_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List all settlement payments recorded for a group."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Group with ID '{group_id}' not found.",
        )

    settlements = (
        db.query(SettlementTransaction)
        .filter(SettlementTransaction.group_id == group_id)
        .order_by(SettlementTransaction.date.desc(), SettlementTransaction.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return settlements
