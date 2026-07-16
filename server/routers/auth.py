from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User
from server.schemas import UserRegister, UserResponse, TokenResponse
from server.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate broker fields
    if user_in.role == "broker":
        if not user_in.broker_license:
            raise HTTPException(
                status_code=400,
                detail="Broker license is required for broker registration",
            )
    elif user_in.role != "buyer":
        raise HTTPException(
            status_code=400, detail="Invalid role. Must be 'broker' or 'buyer'"
        )

    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        role=user_in.role,
        full_name=user_in.full_name,
        phone=user_in.phone,
        broker_license=user_in.broker_license,
        broker_agency=user_in.broker_agency,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/token", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}
