from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
import uuid
from datetime import datetime
import jwt

from server.database import get_db
from server.models import PendingTransaction, Card, User, Account
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
        raise HTTPException(
            status_code=410,
            detail="Verification link has expired (exceeded 10 minutes)",
        )
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=400, detail=f"Token is invalid: {str(e)}")
    except ValueError as e:
        if "expired" in str(e):
            raise HTTPException(
                status_code=410,
                detail="Verification link has expired (exceeded 10 minutes)",
            )
        raise HTTPException(status_code=400, detail=str(e))

    # 3. Check expiration in DB or token
    if transaction.expires_at < datetime.utcnow():
        transaction.status = "expired"
        db.commit()
        raise HTTPException(
            status_code=410,
            detail="Verification link has expired (exceeded 10 minutes)",
        )

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
        raise HTTPException(status_code=400, detail="Invalid action or expired token")
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=400, detail=f"Token is invalid: {str(e)}")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid action or expired token")

    # 3. Check expiration
    if transaction.expires_at < datetime.utcnow():
        transaction.status = "expired"
        db.commit()
        raise HTTPException(status_code=400, detail="Invalid action or expired token")

    # 4. Check if already processed
    if transaction.status in ["approved", "blocked"]:
        raise HTTPException(
            status_code=400, detail="Transaction has already been processed"
        )

    # 5. Validate action
    action = payload_data.action.upper()
    if action not in ["APPROVE", "BLOCK"]:
        raise HTTPException(
            status_code=400, detail="Invalid action. Must be 'APPROVE' or 'BLOCK'"
        )

    # 6. Update transaction status
    transaction.status = "approved" if action == "APPROVE" else "blocked"
    transaction.updated_at = datetime.utcnow()

    # 7. Invalidate token (single-use)
    TokenService.invalidate_token(transaction.token_jti)

    card_status = "ACTIVE"
    wallet_token = None
    message = "Transaction approved successfully."

    if action == "BLOCK":
        card_status = "KILLED"
        wallet_token = f"mock-wallet-token-{uuid.uuid4()}"
        message = "Transaction blocked. Physical card killed. New digital card provisioned to wallet."

        # Find the user's card and kill it
        account = db.query(Account).filter(Account.id == transaction.account_id).first()
        if account:
            user = db.query(User).filter(User.id == account.user_id).first()
            if user:
                # Find active card for this user
                card = (
                    db.query(Card)
                    .filter(Card.user_id == str(user.id), Card.status == "ACTIVE")
                    .first()
                )
                if card:
                    card.status = "KILLED"
                    card.updated_at = datetime.utcnow()

                # Create a new reissued card
                new_card = Card(
                    id=str(uuid.uuid4()),
                    user_id=str(user.id),
                    card_number_last4=str(uuid.uuid4().int)[:4],
                    status="REISSUED",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                db.add(new_card)

    db.commit()
    db.refresh(transaction)

    return {
        "id": transaction.id,
        "status": "APPROVED" if action == "APPROVE" else "BLOCKED",
        "updated_at": transaction.updated_at,
        "card_status": card_status,
        "message": message,
        "transaction_id": transaction.id,
        "wallet_token": wallet_token,
    }
