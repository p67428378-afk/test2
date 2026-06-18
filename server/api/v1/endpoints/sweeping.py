"""
Module: server/api/v1/endpoints/sweeping.py
Purpose: API endpoints for Global Treasury Sweeping Rule Management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import schemas, crud, models
from server.database import get_db
from server.services.fx_service import FXService
from server.services.aml_service import AMLService
from server.services.notification_service import NotificationService

router = APIRouter()


def get_or_create_default_user(db: Session) -> models.User:
    """
    Helper to get or create a default user for sweeping rules.
    """
    user = db.query(models.User).first()
    if not user:
        user = models.User(
            login_id="treasury_manager",
            mobile_number="1234567890",
            hashed_password="hashed_password_123",
            security_question="What is your favorite color?",
            security_answer_hash="hashed_blue",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def seed_default_accounts(db: Session, user_id: str):
    """
    Seed default subsidiary and central accounts if they don't exist.
    """
    accounts_data = [
        {
            "account_number": "CAD-SUB-001",
            "bank_name": "Royal Bank of Canada",
            "currency": "CAD",
            "balance": 150000.0,
            "country": "Canada",
        },
        {
            "account_number": "MXN-SUB-001",
            "bank_name": "Banco de Mexico",
            "currency": "MXN",
            "balance": 2000000.0,
            "country": "Mexico",
        },
        {
            "account_number": "USD-CENTRAL-001",
            "bank_name": "JP Morgan Chase",
            "currency": "USD",
            "balance": 50000.0,
            "country": "United States",
        },
        {
            "account_number": "HIGH-RISK-SUB-001",
            "bank_name": "Risk Bank",
            "currency": "USD",
            "balance": 120000.0,
            "country": "Russia",
        },
    ]
    for acc in accounts_data:
        existing = (
            db.query(models.Account)
            .filter(models.Account.account_number == acc["account_number"])
            .first()
        )
        if not existing:
            db_acc = models.Account(
                user_id=user_id,
                account_number=acc["account_number"],
                bank_name=acc["bank_name"],
                currency=acc["currency"],
                balance=acc["balance"],
                country=acc["country"],
            )
            db.add(db_acc)
    db.commit()


@router.get("/rules", response_model=List[schemas.SweepRuleResponse])
def list_rules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all sweeping rules.
    """
    # Ensure default user and accounts exist
    user = get_or_create_default_user(db)
    seed_default_accounts(db, str(user.id))  # type: ignore

    return crud.get_sweep_rules(db, skip=skip, limit=limit)


@router.post(
    "/rules",
    response_model=schemas.SweepRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_rule(rule: schemas.SweepRuleCreate, db: Session = Depends(get_db)):
    """
    Create a new sweeping rule.
    """
    user = get_or_create_default_user(db)
    seed_default_accounts(db, str(user.id))  # type: ignore

    # Validate source and target accounts exist
    for acc_num in rule.source_accounts:
        acc = crud.get_account_by_number(db, acc_num)
        if not acc:
            raise HTTPException(
                status_code=400, detail=f"Source account {acc_num} not found"
            )

    target_acc = crud.get_account_by_number(db, rule.target_account)
    if not target_acc:
        raise HTTPException(
            status_code=400, detail=f"Target account {rule.target_account} not found"
        )

    db_rule = crud.create_sweep_rule(db, rule, str(user.id))  # type: ignore

    NotificationService.send_notification(
        db,
        str(user.id),
        "RULE_CREATED",
        "New Sweeping Rule Created",  # type: ignore
        f"Rule '{rule.name}' has been created and is pending approval.",
    )

    return db_rule


@router.put("/rules/{rule_id}", response_model=schemas.SweepRuleResponse)
def update_rule(
    rule_id: str, rule_update: schemas.SweepRuleUpdate, db: Session = Depends(get_db)
):
    """
    Update an existing sweeping rule.
    """
    db_rule = crud.get_sweep_rule(db, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    # Validate source and target accounts exist
    for acc_num in rule_update.source_accounts:
        acc = crud.get_account_by_number(db, acc_num)
        if not acc:
            raise HTTPException(
                status_code=400, detail=f"Source account {acc_num} not found"
            )

    target_acc = crud.get_account_by_number(db, rule_update.target_account)
    if not target_acc:
        raise HTTPException(
            status_code=400,
            detail=f"Target account {rule_update.target_account} not found",
        )

    updated_rule = crud.update_sweep_rule(db, db_rule, rule_update)

    NotificationService.send_notification(
        db,
        str(db_rule.user_id),
        "RULE_UPDATED",
        "Sweeping Rule Updated",  # type: ignore
        f"Rule '{db_rule.name}' has been updated.",
    )

    return updated_rule


@router.get("/workflows/{rule_id}", response_model=schemas.WorkflowDetailsResponse)
def get_workflow_details(rule_id: str, db: Session = Depends(get_db)):
    """
    Get workflow details for a rule.
    """
    db_rule = crud.get_sweep_rule(db, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    # Calculate sweep amount and check local capital requirements
    total_sweep_amount = 0.0
    local_limit_compliant = True

    # Let's assume a local capital requirement of keeping at least 20% of the initial balance,
    # or a fixed minimum balance of $20,000 in the source account.
    MIN_REQUIRED_BALANCE = 20000.0

    # We'll use the first source account's currency for simplicity, or default to USD
    source_currency = "USD"

    for acc_num in db_rule.source_accounts:
        acc = crud.get_account_by_number(db, acc_num)
        if acc:
            source_currency = acc.currency
            # Sweep amount is balance above threshold
            if acc.balance > db_rule.threshold:
                sweep_amt = acc.balance - db_rule.threshold
                total_sweep_amount += sweep_amt

                # Check if remaining balance would breach local capital requirements
                remaining = acc.balance - sweep_amt
                if remaining < MIN_REQUIRED_BALANCE:
                    local_limit_compliant = False
            else:
                # If balance is already below threshold, no sweep from this account
                pass

    target_acc = crud.get_account_by_number(db, db_rule.target_account)
    target_currency = target_acc.currency if target_acc else "USD"

    fx_rate = FXService.get_rate(source_currency, target_currency, db_rule.fx_strategy)
    rate_lock_seconds = FXService.get_rate_lock_duration()

    return schemas.WorkflowDetailsResponse(
        rule_id=str(db_rule.id),  # type: ignore
        name=db_rule.name,
        source_accounts=db_rule.source_accounts,
        target_account=db_rule.target_account,
        threshold=db_rule.threshold,
        amount=total_sweep_amount,
        fx_rate=fx_rate,
        hedging_strategy=db_rule.fx_strategy,
        local_limit_compliant=local_limit_compliant,
        rate_lock_seconds=rate_lock_seconds,
        status=db_rule.status,
    )


@router.post("/workflows/{rule_id}/pause", response_model=schemas.WorkflowPauseResponse)
def pause_workflow(rule_id: str, db: Session = Depends(get_db)):
    """
    Pause the approval workflow for a rule.
    """
    db_rule = crud.get_sweep_rule(db, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    if db_rule.status != "PENDING_APPROVAL":
        raise HTTPException(
            status_code=400, detail="Workflow cannot be paused in current state"
        )

    db_rule.status = "PAUSED"
    db.commit()
    db.refresh(db_rule)

    NotificationService.send_notification(
        db,
        str(db_rule.user_id),
        "WORKFLOW_PAUSED",
        "Workflow Paused",  # type: ignore
        f"Approval workflow for rule '{db_rule.name}' has been paused.",
    )

    return schemas.WorkflowPauseResponse(rule_id=str(db_rule.id), status="PAUSED")  # type: ignore


@router.post(
    "/workflows/{rule_id}/approve", response_model=schemas.WorkflowApproveResponse
)
def approve_workflow(rule_id: str, db: Session = Depends(get_db)):
    """
    Approve a sweeping rule and trigger execution.
    """
    db_rule = crud.get_sweep_rule(db, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    if db_rule.status not in ["PENDING_APPROVAL", "PAUSED"]:
        raise HTTPException(
            status_code=400, detail="Workflow cannot be approved in current state"
        )

    # Calculate sweep amount and check local capital requirements
    total_sweep_amount = 0.0
    local_limit_compliant = True
    MIN_REQUIRED_BALANCE = 20000.0
    source_currency = "USD"
    source_country = "United States"

    for acc_num in db_rule.source_accounts:
        acc = crud.get_account_by_number(db, acc_num)
        if acc:
            source_currency = acc.currency
            source_country = acc.country
            if acc.balance > db_rule.threshold:
                sweep_amt = acc.balance - db_rule.threshold
                total_sweep_amount += sweep_amt
                remaining = acc.balance - sweep_amt
                if remaining < MIN_REQUIRED_BALANCE:
                    local_limit_compliant = False

    if not local_limit_compliant:
        raise HTTPException(
            status_code=400,
            detail="Workflow cannot be approved: local capital limit breached",
        )

    target_acc = crud.get_account_by_number(db, db_rule.target_account)
    target_currency = target_acc.currency if target_acc else "USD"

    fx_rate = FXService.get_rate(source_currency, target_currency, db_rule.fx_strategy)

    # Screen for AML
    aml_status = AMLService.screen_transaction(total_sweep_amount, source_country)

    # Create execution record
    execution_data = {
        "rule_id": db_rule.id,
        "amount": total_sweep_amount,
        "currency": source_currency,
        "fx_rate": fx_rate,
        "fx_strategy_used": db_rule.fx_strategy,
        "aml_status": aml_status,
        "status": "COMPLETED" if aml_status == "CLEARED" else "FLAGGED_PENDING_REVIEW",
    }
    db_execution = crud.create_sweep_execution(db, execution_data)

    # Update account balances if cleared
    if aml_status == "CLEARED" and total_sweep_amount > 0:
        for acc_num in db_rule.source_accounts:
            acc = crud.get_account_by_number(db, acc_num)
            if acc and acc.balance > db_rule.threshold:
                sweep_amt = acc.balance - db_rule.threshold
                acc.balance -= sweep_amt

        if target_acc:
            target_acc.balance += total_sweep_amount * fx_rate

        db_rule.status = "APPROVED"
    else:
        db_rule.status = "FLAGGED_FOR_AML"

    db.commit()
    db.refresh(db_rule)

    NotificationService.send_notification(
        db,
        str(db_rule.user_id),
        "WORKFLOW_APPROVED",
        "Workflow Approved",  # type: ignore
        f"Rule '{db_rule.name}' has been approved. Execution status: {db_execution.status}.",
    )

    return schemas.WorkflowApproveResponse(
        rule_id=str(db_rule.id),  # type: ignore
        execution_id=str(db_execution.id),  # type: ignore
        status=db_rule.status,
    )


@router.post(
    "/workflows/{rule_id}/reject", response_model=schemas.WorkflowRejectResponse
)
def reject_workflow(rule_id: str, db: Session = Depends(get_db)):
    """
    Reject a sweeping rule.
    """
    db_rule = crud.get_sweep_rule(db, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    db_rule.status = "REJECTED"
    db.commit()
    db.refresh(db_rule)

    NotificationService.send_notification(
        db,
        str(db_rule.user_id),
        "WORKFLOW_REJECTED",
        "Workflow Rejected",  # type: ignore
        f"Rule '{db_rule.name}' has been rejected.",
    )

    return schemas.WorkflowRejectResponse(rule_id=str(db_rule.id), status="REJECTED")  # type: ignore


@router.post(
    "/workflows/{rule_id}/adjust", response_model=schemas.WorkflowAdjustResponse
)
def adjust_workflow(
    rule_id: str,
    adjust_req: schemas.WorkflowAdjustRequest,
    db: Session = Depends(get_db),
):
    """
    Adjust parameters of a sweeping rule (from mobile app).
    """
    db_rule = crud.get_sweep_rule(db, rule_id)
    if not db_rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    db_rule.fx_strategy = adjust_req.fx_strategy
    db_rule.threshold = adjust_req.threshold
    db.commit()
    db.refresh(db_rule)

    NotificationService.send_notification(
        db,
        str(db_rule.user_id),
        "WORKFLOW_ADJUSTED",
        "Workflow Parameters Adjusted",  # type: ignore
        f"Parameters for rule '{db_rule.name}' have been adjusted.",
    )

    return schemas.WorkflowAdjustResponse(
        rule_id=str(db_rule.id),  # type: ignore
        fx_strategy=db_rule.fx_strategy,
        threshold=db_rule.threshold,
        status=db_rule.status,
    )
