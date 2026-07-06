from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
import jwt

from server.database import get_db
from server.models import PendingTransaction
from server.schemas import (
    TransactionVerifyResponse,
    TransactionActionRequest,
    TransactionActionResponse,
)
from server.services.token_service import TokenService

router = APIRouter()


@router.get("/transactions/{id}/verify", response_model=TransactionVerifyResponse)
def verify_transaction(
    id: UUID,
    token: str = Query(..., description="Secure single-use JWT token"),
    db: Session = Depends(get_db),
):
    # 1. Find transaction
    transaction = (
        db.query(PendingTransaction).filter(PendingTransaction.id == id).first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # 2. Verify token
    try:
        payload = TokenService.verify_token(token)
        # Ensure token belongs to this transaction
        if payload.get("sub") != str(id):
            raise HTTPException(
                status_code=400, detail="Token is invalid for this transaction"
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=400, detail=f"Token is invalid: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Check expiration in DB or token
    if transaction.expires_at < datetime.utcnow():
        transaction.status = "expired"
        db.commit()
        raise HTTPException(status_code=403, detail="Token has expired")

    # 4. Check if already processed
    if transaction.status in ["approved", "blocked"]:
        raise HTTPException(
            status_code=400, detail="Transaction has already been processed"
        )

    return transaction


@router.post("/transactions/{id}/action", response_model=TransactionActionResponse)
def perform_transaction_action(
    id: UUID, payload_data: TransactionActionRequest, db: Session = Depends(get_db)
):
    # 1. Find transaction
    transaction = (
        db.query(PendingTransaction).filter(PendingTransaction.id == id).first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # 2. Verify token
    try:
        payload = TokenService.verify_token(payload_data.token)
        if payload.get("sub") != str(id):
            raise HTTPException(
                status_code=400, detail="Token is invalid for this transaction"
            )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=400, detail=f"Token is invalid: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Check expiration
    if transaction.expires_at < datetime.utcnow():
        transaction.status = "expired"
        db.commit()
        raise HTTPException(status_code=403, detail="Token has expired")

    # 4. Check if already processed
    if transaction.status in ["approved", "blocked"]:
        raise HTTPException(
            status_code=400, detail="Transaction has already been processed"
        )

    # 5. Validate action
    action = payload_data.action.lower()
    if action not in ["approve", "block"]:
        raise HTTPException(
            status_code=400, detail="Invalid action. Must be 'approve' or 'block'"
        )

    # 6. Update transaction status
    transaction.status = "approved" if action == "approve" else "blocked"
    transaction.updated_at = datetime.utcnow()

    # 7. Invalidate token (single-use)
    TokenService.invalidate_token(transaction.token_jti)

    db.commit()
    db.refresh(transaction)

    return transaction
