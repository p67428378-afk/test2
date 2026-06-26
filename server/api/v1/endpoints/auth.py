from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import schemas, crud
from server.database import get_db
from server.core.security import create_access_token, verify_password

router = APIRouter()


@router.post(
    "/users/register",
    response_model=schemas.UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user_in: schemas.UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if username exists
    db_user = crud.get_user_by_username(db, username=user_in.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    # Check if email exists
    db_user = crud.get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    user = crud.create_user(db, user_in=user_in)
    return schemas.UserRegisterResponse(
        id=str(user.id),
        username=user.username,
        email=user.email,
        role=user.role,
        created_at=user.created_at.isoformat(),
    )


@router.post("/users/login", response_model=schemas.UserLoginResponse)
def login(login_in: schemas.UserLoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=login_in.username)
    if not user or not verify_password(login_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    access_token = create_access_token(data={"sub": user.username})
    return schemas.UserLoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=schemas.UserLoginUserDetail(
            id=str(user.id), username=user.username, email=user.email, role=user.role
        ),
    )
