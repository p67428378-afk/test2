from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User
from server.schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from server.crypto import get_password_hash, verify_password
from server.auth import create_access_token

router = APIRouter()


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    hashed_pwd, salt = get_password_hash(user_in.master_password)

    new_user = User(email=user_in.email, master_password_hash=hashed_pwd, salt=salt)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=str(new_user.id), email=new_user.email, created_at=new_user.created_at
    )


@router.post("/login", response_model=TokenResponse)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(
        user_in.master_password, user.master_password_hash, user.salt
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or master password",
        )

    access_token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=access_token, derived_key_salt=user.salt)
