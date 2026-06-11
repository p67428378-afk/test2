from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user, verify_password

router = APIRouter()

@router.post("/transfers/internal", response_model=schemas.InternalTransferResponse)
def internal_transfer(
    request: schemas.InternalTransferRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if request.from_account_id == request.to_account_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source and destination accounts must be different"
        )
    
    if request.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transfer amount must be greater than zero"
        )

    from_account = crud.get_account_by_id(db, request.from_account_id)
    to_account = crud.get_account_by_id(db, request.to_account_id)

    if not from_account or from_account.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source account not found"
        )
    
    if not to_account or to_account.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination account not found"
        )

    if float(from_account.balance) < request.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds"
        )

    try:
        # Perform atomic transfer
        from_account.balance = float(from_account.balance) - request.amount
        to_account.balance = float(to_account.balance) + request.amount

        # Create transaction record
        transaction = crud.create_transaction(
            db=db,
            from_account_id=from_account.id,
            to_account_id=to_account.id,
            amount=request.amount,
            type="Internal Transfer",
            memo=request.memo
        )
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transfer failed: {str(e)}"
        )

    return schemas.InternalTransferResponse(
        transaction_id=transaction.id,
        from_account_id=from_account.id,
        to_account_id=to_account.id,
        amount=request.amount,
        type="Internal Transfer",
        memo=transaction.memo,
        new_from_balance=float(from_account.balance),
        new_to_balance=float(to_account.balance),
        created_at=transaction.created_at
    )

@router.post("/transfers/p2p", response_model=schemas.P2PTransferResponse)
def p2p_transfer(
    request: schemas.P2PTransferRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(request.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    if request.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transfer amount must be greater than zero"
        )

    from_account = crud.get_account_by_id(db, request.from_account_id)
    if not from_account or from_account.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source account not found"
        )

    recipient_account = crud.get_account_by_number(db, request.recipient_account_number)
    if not recipient_account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient account number not found"
        )

    if recipient_account.id == from_account.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot perform P2P transfer to the same account"
        )

    if float(from_account.balance) < request.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds"
        )

    # Enforce daily limit of $5,000
    daily_total = crud.get_p2p_transfers_total_today(db, current_user.id)
    if daily_total + request.amount > 5000.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Daily P2P transfer limit of $5,000 exceeded"
        )

    try:
        # Perform atomic transfer
        from_account.balance = float(from_account.balance) - request.amount
        recipient_account.balance = float(recipient_account.balance) + request.amount

        # Create transaction record
        transaction = crud.create_transaction(
            db=db,
            from_account_id=from_account.id,
            to_account_id=recipient_account.id,
            amount=request.amount,
            type="P2P Transfer",
            memo=request.memo
        )
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transfer failed: {str(e)}"
        )

    return schemas.P2PTransferResponse(
        transaction_id=transaction.id,
        from_account_id=from_account.id,
        to_account_id=recipient_account.id,
        amount=request.amount,
        type="P2P Transfer",
        memo=transaction.memo,
        new_from_balance=float(from_account.balance),
        created_at=transaction.created_at
    )
