from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from server.database import get_db
from server.models import User
from server.schemas import UserRegister, UserLogin, Token, UserResponse
from server.security import (
    hash_password,
    verify_password,
    generate_salt,
    create_access_token,
    derive_dek,
)
from server.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# In-memory store for derived DEKs (keyed by user_id)
active_deks = {}


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    # Check if DEK is available for this user
    if user.id not in active_deks:
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail="Vault is locked. Please log in again to derive the encryption key.",
        )

    return user


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    salt = generate_salt()
    hashed = hash_password(user_in.master_password)

    new_user = User(email=user_in.email, master_password_hash=hashed, salt=salt)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail="Invalid credentials",
        )

    # Check if account is locked
    if user.locked_until and user.locked_until.replace(
        tzinfo=timezone.utc
    ) > datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account temporarily locked due to too many failed attempts",
        )

    if not verify_password(user.master_password_hash, user_in.master_password):
        # Increment failed attempts
        user.failed_login_attempts += 1
        if user.failed_login_attempts >= 5:
            # Lock for 15 minutes
            from datetime import timedelta

            user.locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    # Reset failed attempts on successful login
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()

    # Derive DEK and store in-memory
    dek = derive_dek(user_in.master_password, user.salt)
    active_deks[user.id] = dek

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
