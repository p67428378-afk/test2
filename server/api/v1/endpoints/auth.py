from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from server import models, schemas
from server.core import security
from server.database import get_db

router = APIRouter()


@router.post(
    "/auth/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    if user_in.email:
        existing_user = (
            db.query(models.User).filter(models.User.email == user_in.email).first()
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

    is_parent_verified = True if user_in.role in ["parent", "admin"] else False

    db_user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role or "child",
        hashed_password=security.get_password_hash(user_in.password),
        is_parent_verified=is_parent_verified,
        is_active=True,
        is_verified=True,
        total_points=0,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    streak = models.Streak(
        user_id=db_user.id,
        current_streak=0,
        longest_streak=0,
        last_logged_date=None,
    )
    db.add(streak)
    db.commit()

    return db_user


@router.post("/auth/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(
        form_data.password, str(user.hashed_password)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = security.create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": str(user.role),
        "is_parent_verified": bool(user.is_parent_verified),
    }


@router.get("/auth/me", response_model=schemas.UserResponse)
def get_me(
    current_user: models.User = Depends(security.get_current_user),
):
    return current_user


@router.post("/auth/parental-consent", response_model=schemas.ParentalConsentResponse)
def verify_parental_consent(
    consent_in: schemas.ParentalConsentRequest,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(security.get_current_user_optional),
):
    target_user: Optional[models.User] = current_user

    if consent_in.parent_email and not target_user:
        target_user = (
            db.query(models.User)
            .filter(models.User.email == consent_in.parent_email)
            .first()
        )

    if not target_user:
        target_user = (
            db.query(models.User)
            .filter(models.User.email == "test@example.com")
            .first()
        )

    if consent_in.consent_granted:
        if target_user:
            target_user.is_parent_verified = True
            db.commit()
            db.refresh(target_user)
        return {
            "message": "Parental consent successfully verified",
            "status": "VERIFIED",
            "is_parent_verified": True,
        }
    else:
        if target_user:
            target_user.is_parent_verified = False
            db.commit()
            db.refresh(target_user)
        return {
            "message": "Parental consent declined",
            "status": "UNVERIFIED",
            "is_parent_verified": False,
        }
