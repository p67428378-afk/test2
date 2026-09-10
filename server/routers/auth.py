from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import UserModel
from server.schemas import UserCreate, UserResponse, Token
from server.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_pwd = get_password_hash(user_in.password)
    new_user = UserModel(
        email=user_in.email,
        password_hash=hashed_pwd,
        full_name=user_in.full_name,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: Session = Depends(get_db),
):
    email = None
    password = None

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
        email = body.get("email") or body.get("username")
        password = body.get("password")
    else:
        try:
            form_data = await request.form()
            form_user = form_data.get("username") or form_data.get("email")
            email = str(form_user) if form_user else None
            form_pwd = form_data.get("password")
            password = str(form_pwd) if form_pwd else None
        except Exception:
            pass

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email/username and password are required",
        )

    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user or not verify_password(password, str(user.password_hash)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account",
        )

    access_token = create_access_token(
        data={"sub": str(user.email), "user_id": str(user.id)}
    )
    user_response = UserResponse.model_validate(user)
    return Token(access_token=access_token, token_type="bearer", user=user_response)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user
