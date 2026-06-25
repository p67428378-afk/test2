import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db

router = APIRouter()
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    try:
        user_id = uuid.UUID(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return user


@router.post(
    "/payment/token",
    response_model=schemas.PaymentTokenResponse,
    status_code=status.HTTP_201_CREATED,
)
def save_payment_token(
    card_data: schemas.PaymentTokenCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate token is not empty
    if not card_data.payment_token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment token"
        )

    # Validate card last four is 4 digits
    if not card_data.card_last_four.isdigit() or len(card_data.card_last_four) != 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Card last four must be exactly 4 digits",
        )

    # Create saved card
    db_card = crud.create_user_saved_card(db, current_user.id, card_data)
    return db_card


@router.get("/user/cards", response_model=List[schemas.SavedCardResponse])
def get_saved_cards(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Pagination rule: limit must be capped
    if limit > 100:
        limit = 100
    cards = crud.get_user_saved_cards(db, current_user.id, skip=skip, limit=limit)
    return cards


@router.delete("/user/cards/{card_id}", response_model=schemas.DeleteCardResponse)
def delete_saved_card(
    card_id: uuid.UUID,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    success = crud.delete_user_saved_card(db, card_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Card not found or does not belong to user",
        )
    return schemas.DeleteCardResponse(message="Card deleted successfully", success=True)


@router.post(
    "/payment/charge",
    response_model=schemas.ChargeResponse,
    status_code=status.HTTP_201_CREATED,
)
def charge_payment(
    charge_data: schemas.ChargeRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if charge_data.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Amount must be greater than zero",
        )

    token_to_use = None

    if charge_data.card_id:
        # Using saved card
        db_card = crud.get_user_saved_card_by_id(
            db, charge_data.card_id, current_user.id
        )
        if not db_card:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Saved card not found or does not belong to user",
            )

        # CVV is required for saved card
        if (
            not charge_data.cvv
            or len(charge_data.cvv) < 3
            or len(charge_data.cvv) > 4
            or not charge_data.cvv.isdigit()
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid CVV code"
            )

        token_to_use = db_card.payment_gateway_token
    elif charge_data.payment_token:
        # Using new card token
        token_to_use = charge_data.payment_token
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either card_id or payment_token must be provided",
        )

    # Simulate payment gateway processing
    # Simulate insufficient funds or invalid details
    if charge_data.cvv == "000":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds or invalid details",
        )

    transaction_id = f"ch_{uuid.uuid4().hex[:16]}"
    return schemas.ChargeResponse(
        message="Payment processed successfully",
        success=True,
        transaction_id=transaction_id,
    )
