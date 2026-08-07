from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas import SellerRegister, SellerResponse, SellerLogin, TokenResponse
from server import crud
from server.core.security import create_access_token, verify_password

router = APIRouter()


@router.post(
    "/register", response_model=SellerResponse, status_code=status.HTTP_201_CREATED
)
def register_seller(seller_in: SellerRegister, db: Session = Depends(get_db)):
    db_seller = crud.get_seller_by_email(db, email=seller_in.email)
    if db_seller:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered",
        )
    return crud.create_seller(db, seller_in=seller_in)


@router.post("/login", response_model=TokenResponse)
def login_seller(login_in: SellerLogin, db: Session = Depends(get_db)):
    db_seller = crud.get_seller_by_email(db, email=login_in.email)
    if not db_seller or not verify_password(login_in.password, db_seller.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Strict 5-minute TTL (300 seconds)
    expires_delta = timedelta(minutes=5)
    access_token = create_access_token(
        subject=db_seller.id,
        email=db_seller.email,
        role="ROLE_SELLER",
        expires_delta=expires_delta,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in_seconds": 300,
        "seller": {
            "id": db_seller.id,
            "store_name": db_seller.store_name,
            "email": db_seller.email,
        },
    }
