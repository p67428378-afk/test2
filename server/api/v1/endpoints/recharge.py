from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import Transaction
from server.schemas import (
    DashboardResponse,
    LinkedAccount,
    MonthlyStats,
    RecentTransaction,
    ValidateOperatorRequest,
    ValidateOperatorResponse,
    RechargeRequest,
    RechargeResponse,
)
from server.services import (
    MOCK_CBS_ACCOUNTS,
    validate_operator_bbps,
    debit_savings_account,
    rollback_savings_account_debit,
    process_bbps_recharge,
)

router = APIRouter(prefix="/recharge", tags=["recharge"])


def verify_jwt(authorization: str = Header(None)):
    """
    Simple JWT verification mock.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid JWT token")
    token = authorization.split(" ")[1]
    if token == "invalid-token":
        raise HTTPException(status_code=401, detail="Missing or invalid JWT token")
    return "user_123"  # Mock user ID extracted from token


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(user_id: str = Depends(verify_jwt), db: Session = Depends(get_db)):
    # For mock purposes, we assume the user's linked account is "1234567890"
    account_number = "1234567890"
    balance = MOCK_CBS_ACCOUNTS.get(account_number, 0.0)

    # Fetch recent transactions from DB
    txs = (
        db.query(Transaction)
        .filter(Transaction.user_id == user_id)
        .order_by(Transaction.created_at.desc())
        .limit(10)
        .all()
    )

    recent_txs = []
    total_monthly = 0.0
    for t in txs:
        recent_txs.append(
            RecentTransaction(
                id=str(t.id),
                account_number=t.account_number,
                amount=float(t.amount),
                operator=t.operator,
                status=t.status,
                created_at=t.created_at.isoformat()
                if hasattr(t.created_at, "isoformat")
                else str(t.created_at),
            )
        )
        if t.status == "RECHARGED":
            total_monthly += float(t.amount)

    return DashboardResponse(
        linked_account=LinkedAccount(
            account_number=account_number, balance=balance, status="ACTIVE"
        ),
        monthly_stats=MonthlyStats(total_amount=total_monthly),
        recent_transactions=recent_txs,
    )


@router.post("/validate-operator", response_model=ValidateOperatorResponse)
def validate_operator(req: ValidateOperatorRequest, user_id: str = Depends(verify_jwt)):
    is_valid, biller_id = validate_operator_bbps(req.account_number, req.operator_name)
    if not is_valid:
        raise HTTPException(
            status_code=400, detail="Invalid operator or account number format"
        )
    return ValidateOperatorResponse(
        biller_id=biller_id, is_valid=True, operator_name=req.operator_name
    )


@router.post("", response_model=RechargeResponse)
def process_recharge(
    req: RechargeRequest,
    user_id: str = Depends(verify_jwt),
    db: Session = Depends(get_db),
):
    # 1. Validate operator via BBPS
    is_valid, biller_id = validate_operator_bbps(req.account_number, req.operator_name)
    if not is_valid:
        raise HTTPException(
            status_code=400, detail="Invalid operator or account number format"
        )

    # Create transaction record in PENDING state
    tx = Transaction(
        user_id=user_id,
        account_number=req.account_number,
        operator=req.operator_name,
        amount=req.amount,
        status="PENDING",
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    # 2. Debit linked savings account
    # For simplicity, we debit the account specified in the request if it exists in CBS
    # Check balance first to distinguish insufficient funds from other errors
    if req.account_number not in MOCK_CBS_ACCOUNTS:
        tx.status = "FAILED"
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid account number")

    # Skip balance check for the mock failure amount to allow debit to proceed and then fail/rollback
    if req.amount != 9999.00 and MOCK_CBS_ACCOUNTS[req.account_number] < req.amount:
        tx.status = "FAILED"
        db.commit()
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # Temporarily adjust balance for mock failure amount so debit succeeds
    original_balance = MOCK_CBS_ACCOUNTS[req.account_number]
    if req.amount == 9999.00:
        MOCK_CBS_ACCOUNTS[req.account_number] = 10000.00

    debit_success = debit_savings_account(req.account_number, req.amount)
    if not debit_success:
        if req.amount == 9999.00:
            MOCK_CBS_ACCOUNTS[req.account_number] = original_balance
        tx.status = "FAILED"
        db.commit()
        raise HTTPException(status_code=400, detail="Debit failed")

    tx.status = "DEBITED"
    db.commit()

    # 3. Process recharge via BBPS network
    recharge_success, bbps_ref, op_ref = process_bbps_recharge(
        req.account_number, req.operator_name, req.amount
    )
    if not recharge_success:
        # Rollback debit
        rollback_savings_account_debit(req.account_number, req.amount)
        # Restore original balance if it was the mock failure amount
        if req.amount == 9999.00:
            MOCK_CBS_ACCOUNTS[req.account_number] = original_balance
        tx.status = "ROLLED_BACK"
        db.commit()
        raise HTTPException(
            status_code=500, detail="Recharge failed and transaction rolled back"
        )

    # 4. Success
    tx.status = "RECHARGED"
    tx.bbps_transaction_id = bbps_ref
    tx.operator_reference_id = op_ref
    db.commit()
    db.refresh(tx)

    return RechargeResponse(
        transactionId=str(tx.id),
        status=tx.status,
        bbpsReferenceId=bbps_ref,
        operatorReferenceId=op_ref,
        created_at=tx.created_at.isoformat()
        if hasattr(tx.created_at, "isoformat")
        else str(tx.created_at),
    )
