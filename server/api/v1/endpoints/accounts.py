from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
import uuid

from server.database import get_db
from server import models, schemas, crud

router = APIRouter()

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    token = authorization.split(" ")[1]
    
    if token.startswith("expired-token-"):
        raise HTTPException(status_code=401, detail="AUTH_EXPIRED")
    
    if token.startswith("valid-token-"):
        user_id_str = token.replace("valid-token-", "")
        try:
            user_uuid = uuid.UUID(user_id_str)
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid session token format")
            
        user = db.query(models.User).filter(models.User.id == user_uuid).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
        
    raise HTTPException(status_code=401, detail="Invalid session token")

def mask_account_number(acc_num: str) -> str:
    if len(acc_num) <= 4:
        return "*" * len(acc_num)
    return "*" * (len(acc_num) - 4) + acc_num[-4:]

@router.get("/accounts/{accountId}/balance", response_model=schemas.BalanceInquiryResponse)
def get_balance(
    accountId: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    account = crud.get_account(db, account_id=accountId)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Verify ownership
    if str(account.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Requested account does not belong to the authenticated user")
    
    # Log the inquiry for audit purposes (PMLA 2002 compliance)
    details = f"Balance inquiry for account {account.account_number}. Status: {account.status}, Reason: {account.reason_code}"
    crud.create_audit_log(
        db=db,
        user_id=str(current_user.id),
        account_id=str(account.id),
        event_type="BALANCE_INQUIRY",
        details=details
    )
    
    # Handle dormant/frozen status
    status = account.status
    reason_code = account.reason_code
    if status == "DORMANT":
        reason_code = "ACC_DORMANT"
    elif status == "FROZEN":
        reason_code = "ACC_FROZEN"
        
    return schemas.BalanceInquiryResponse(
        accountNumber=mask_account_number(account.account_number),
        availableBalance=float(account.available_balance),
        currency=account.currency,
        ledgerBalance=float(account.ledger_balance),
        reasonCode=reason_code,
        remainingLimit=float(account.remaining_daily_limit),
        status=status,
        timestamp=datetime.utcnow().isoformat()
    )

@router.get("/accounts/{accountId}/transactions", response_model=schemas.TransactionsResponse)
def get_transactions(
    accountId: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    account = crud.get_account(db, account_id=accountId)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    if str(account.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Requested account does not belong to the authenticated user")
        
    transactions = crud.get_transactions_by_account(db, account_id=accountId, skip=skip, limit=limit)
    
    transaction_items = []
    for tx in transactions:
        transaction_items.append(
            schemas.TransactionItem(
                accountId=str(tx.account_id),
                amount=float(tx.amount),
                description=tx.description,
                id=str(tx.id),
                timestamp=tx.timestamp.isoformat(),
                type=tx.type
            )
        )
        
    return schemas.TransactionsResponse(transactions=transaction_items)
