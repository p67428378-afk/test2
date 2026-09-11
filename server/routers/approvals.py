from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, WorkflowHistory
from server.schemas import ApprovalAction, ContractOut, WorkflowHistoryOut
from server.auth import get_current_user
from server.services import process_approval_action, get_contract_by_id

router = APIRouter(prefix="/api/v1/contracts", tags=["Approvals"])


@router.post("/{id}/approvals", response_model=ContractOut)
def submit_approval_action(
    id: str,
    action_in: ApprovalAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return process_approval_action(db, id, action_in, current_user)


@router.get("/{id}/approvals", response_model=List[WorkflowHistoryOut])
@router.get("/{id}/workflow-history", response_model=List[WorkflowHistoryOut])
def get_workflow_history(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_contract_by_id(db, id)
    return (
        db.query(WorkflowHistory)
        .filter(WorkflowHistory.contract_id == id)
        .order_by(WorkflowHistory.created_at.desc())
        .all()
    )
