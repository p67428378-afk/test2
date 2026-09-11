import uuid
from datetime import date, datetime
from typing import Optional, List, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from server.models import (
    Contract,
    ContractVersion,
    ContractComment,
    WorkflowHistory,
    RenewalReminder,
    Vendor,
    User,
)
from server.schemas import ContractCreate, ContractUpdate, CommentCreate, ApprovalAction


def get_or_create_vendor(
    db: Session, vendor_id: Optional[str] = None, vendor_name: Optional[str] = None
) -> Vendor:
    if vendor_id:
        vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
        if vendor:
            return vendor
    if vendor_name:
        vendor = db.query(Vendor).filter(Vendor.name == vendor_name).first()
        if vendor:
            return vendor
        vendor = Vendor(
            id=str(uuid.uuid4()),
            name=vendor_name,
            contact_email="vendor@example.com",
            status="Active",
        )
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
        return vendor

    # Fallback to first existing vendor or create default
    vendor = db.query(Vendor).first()
    if not vendor:
        vendor = Vendor(
            id=str(uuid.uuid4()),
            name="Default Vendor",
            contact_email="vendor@example.com",
            status="Active",
        )
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
    return vendor


def create_contract(db: Session, contract_in: ContractCreate, user: User) -> Contract:
    if (
        not contract_in.title
        or not contract_in.effective_date
        or not contract_in.termination_date
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title, effective_date, and termination_date are required.",
        )

    if contract_in.termination_date < contract_in.effective_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Termination date cannot be before effective date.",
        )

    vendor = get_or_create_vendor(
        db, vendor_id=contract_in.vendor_id, vendor_name=contract_in.vendor_name
    )

    contract_number = f"CNT-2026-{uuid.uuid4().hex[:6].upper()}"
    contract_id = str(uuid.uuid4())

    contract = Contract(
        id=contract_id,
        contract_number=contract_number,
        vendor_id=vendor.id,
        title=contract_in.title,
        status="Draft",
        current_version="v1.0",
        version_number=1,
        effective_date=contract_in.effective_date,
        termination_date=contract_in.termination_date,
        total_value=contract_in.total_value,
        terms=contract_in.terms or "Initial contract draft terms.",
        document_url=contract_in.document_url,
        created_by=user.id,
    )
    db.add(contract)

    # Initial version record
    initial_version = ContractVersion(
        id=str(uuid.uuid4()),
        contract_id=contract_id,
        version_string="v1.0",
        version_number=1,
        terms_content=contract.terms,
        document_url=contract.document_url,
        change_summary="Initial contract creation",
        created_by=user.id,
    )
    db.add(initial_version)

    # Initial workflow history record
    wf_history = WorkflowHistory(
        id=str(uuid.uuid4()),
        contract_id=contract_id,
        action="CREATE_DRAFT",
        from_stage=None,
        to_stage="Draft",
        actor_id=user.id,
        remarks="Contract created as Draft",
    )
    db.add(wf_history)

    db.commit()
    db.refresh(contract)
    return contract


def get_contracts(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[str] = None,
    vendor_id: Optional[str] = None,
    user: Optional[User] = None,
) -> Tuple[List[Contract], int]:
    query = db.query(Contract)
    if status_filter:
        query = query.filter(Contract.status == status_filter)
    if vendor_id:
        query = query.filter(Contract.vendor_id == vendor_id)

    total = query.count()
    contracts = (
        query.order_by(Contract.created_at.desc()).offset(skip).limit(limit).all()
    )
    return contracts, total


def get_contract_by_id(db: Session, contract_id: str) -> Contract:
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contract with ID '{contract_id}' not found.",
        )
    return contract


def update_contract(
    db: Session, contract_id: str, contract_in: ContractUpdate, user: User
) -> Contract:
    contract = get_contract_by_id(db, contract_id)

    # Optimistic Concurrency Control (OCC)
    if contract_in.current_version_num is not None:
        if contract_in.current_version_num != contract.version_number:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Optimistic concurrency lock failure: provided version ({contract_in.current_version_num}) does not match current version ({contract.version_number}). Please refresh and try again.",
            )

    new_version_num = contract.version_number + 1
    new_version_str = f"v1.{new_version_num - 1}"

    if contract_in.title is not None:
        contract.title = contract_in.title
    if contract_in.effective_date is not None:
        contract.effective_date = contract_in.effective_date
    if contract_in.termination_date is not None:
        contract.termination_date = contract_in.termination_date
    if contract_in.total_value is not None:
        contract.total_value = contract_in.total_value
    if contract_in.terms is not None:
        contract.terms = contract_in.terms
    if contract_in.document_url is not None:
        contract.document_url = contract_in.document_url

    contract.version_number = new_version_num
    contract.current_version = new_version_str
    contract.updated_at = datetime.utcnow()

    # Add version snapshot
    version_record = ContractVersion(
        id=str(uuid.uuid4()),
        contract_id=contract.id,
        version_string=new_version_str,
        version_number=new_version_num,
        terms_content=contract.terms,
        document_url=contract.document_url,
        change_summary=contract_in.change_summary or "Contract terms updated",
        created_by=user.id,
    )
    db.add(version_record)

    wf_history = WorkflowHistory(
        id=str(uuid.uuid4()),
        contract_id=contract.id,
        action="UPDATE_TERMS",
        from_stage=contract.status,
        to_stage=contract.status,
        actor_id=user.id,
        remarks=contract_in.change_summary or f"Version updated to {new_version_str}",
    )
    db.add(wf_history)

    db.commit()
    db.refresh(contract)
    return contract


def get_contract_versions(db: Session, contract_id: str) -> List[ContractVersion]:
    get_contract_by_id(db, contract_id)  # verify existence
    return (
        db.query(ContractVersion)
        .filter(ContractVersion.contract_id == contract_id)
        .order_by(ContractVersion.version_number.desc())
        .all()
    )


def add_comment(
    db: Session, contract_id: str, comment_in: CommentCreate, user: User
) -> ContractComment:
    contract = get_contract_by_id(db, contract_id)

    text_content = comment_in.content or comment_in.comment_text
    if not text_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Comment content/text cannot be empty.",
        )

    # Comments added during active approval stages (Legal Review, Finance Approval) are locked against deletion
    is_locked = contract.status in ["Legal Review", "Finance Approval"]

    # External vendor user posting comment cannot mark as internal_only
    is_internal = comment_in.is_internal_only
    if user.role == "vendor_representative":
        is_internal = False

    comment = ContractComment(
        id=str(uuid.uuid4()),
        contract_id=contract.id,
        parent_id=comment_in.parent_id,
        user_id=user.id,
        clause_reference=comment_in.clause_reference,
        content=text_content,
        is_internal_only=is_internal,
        is_locked=is_locked,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def get_comments(db: Session, contract_id: str, user: User) -> List[ContractComment]:
    get_contract_by_id(db, contract_id)
    query = db.query(ContractComment).filter(ContractComment.contract_id == contract_id)

    # Filter out internal comments for external vendor reps
    if user.role == "vendor_representative":
        query = query.filter(ContractComment.is_internal_only == False)

    return query.order_by(ContractComment.created_at.asc()).all()


def process_approval_action(
    db: Session, contract_id: str, action_in: ApprovalAction, user: User
) -> Contract:
    contract = get_contract_by_id(db, contract_id)

    action = action_in.action.upper()
    current_status = contract.status

    stage_transitions = {
        "DRAFT": {
            "SUBMIT": "Legal Review",
            "SUBMIT_FOR_REVIEW": "Legal Review",
            "APPROVE": "Legal Review",
        },
        "LEGAL REVIEW": {"APPROVE": "Finance Approval", "REJECT": "Draft"},
        "FINANCE APPROVAL": {"APPROVE": "Pending Signature", "REJECT": "Draft"},
        "PENDING SIGNATURE": {
            "APPROVE": "Executed",
            "EXECUTE": "Executed",
            "REJECT": "Draft",
        },
        "EXECUTED": {"EXPIRE": "Expired"},
    }

    norm_status = current_status.upper()
    if norm_status not in stage_transitions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot perform approval action on contract in status '{current_status}'.",
        )

    possible_actions = stage_transitions[norm_status]
    if action not in possible_actions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Action '{action}' is invalid for status '{current_status}'. Allowed actions: {list(possible_actions.keys())}",
        )

    next_status = action_in.target_stage or possible_actions[action]

    # Rejection requires non-empty remarks
    if action == "REJECT":
        if not action_in.comments or not action_in.comments.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Rejection requires non-empty rejection remarks/comments.",
            )

    contract.status = next_status
    contract.updated_at = datetime.utcnow()

    wf_history = WorkflowHistory(
        id=str(uuid.uuid4()),
        contract_id=contract.id,
        action=action,
        from_stage=current_status,
        to_stage=next_status,
        actor_id=user.id,
        remarks=action_in.comments
        or f"Transitioned from {current_status} to {next_status}",
    )
    db.add(wf_history)

    db.commit()
    db.refresh(contract)
    return contract


def process_reminders(db: Session) -> dict:
    today = date.today()
    active_contracts = (
        db.query(Contract)
        .filter(Contract.status.notin_(["Expired", "Terminated"]))
        .all()
    )

    processed = len(active_contracts)
    reminders_sent = 0
    expired = 0

    for contract in active_contracts:
        delta_days = (contract.termination_date - today).days

        # Auto transition to Expired if termination date passed
        if delta_days <= 0:
            contract.status = "Expired"
            contract.updated_at = datetime.utcnow()
            wf_history = WorkflowHistory(
                id=str(uuid.uuid4()),
                contract_id=contract.id,
                action="EXPIRE",
                from_stage=contract.status,
                to_stage="Expired",
                actor_id=None,
                remarks=f"Automated expiry on termination date ({contract.termination_date})",
            )
            db.add(wf_history)
            expired += 1
            continue

        # Check renewal milestones: 90, 60, 30, 15
        milestones = [90, 60, 30, 15]
        for milestone in milestones:
            if delta_days <= milestone:
                # Check if reminder already sent for this milestone
                existing = (
                    db.query(RenewalReminder)
                    .filter(
                        RenewalReminder.contract_id == contract.id,
                        RenewalReminder.reminder_stage_days == milestone,
                    )
                    .first()
                )

                if not existing:
                    recipient = (
                        contract.vendor.contact_email
                        if contract.vendor
                        else "procurement@example.com"
                    )
                    reminder = RenewalReminder(
                        id=str(uuid.uuid4()),
                        contract_id=contract.id,
                        reminder_stage_days=milestone,
                        recipient_email=recipient,
                        status="SENT",
                        sent_at=datetime.utcnow(),
                    )
                    db.add(reminder)
                    reminders_sent += 1

    db.commit()
    return {
        "processed_contracts": processed,
        "reminders_sent": reminders_sent,
        "expired_contracts": expired,
    }


def get_reminders(db: Session) -> List[dict]:
    reminders = db.query(RenewalReminder).order_by(RenewalReminder.sent_at.desc()).all()
    result = []
    today = date.today()

    for r in reminders:
        c = r.contract
        days_rem = (c.termination_date - today).days if c else None
        result.append(
            {
                "id": r.id,
                "contract_id": r.contract_id,
                "reminder_stage_days": r.reminder_stage_days,
                "recipient_email": r.recipient_email,
                "status": r.status,
                "sent_at": r.sent_at,
                "contract_title": c.title if c else None,
                "days_remaining": days_rem,
            }
        )
    return result
