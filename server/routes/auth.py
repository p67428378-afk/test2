from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import User, VisitorProfile
from server.schemas import UserRegister, UserLogin, TokenResponse, VisitorResponse
from server.auth import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post(
    "/register", response_model=VisitorResponse, status_code=status.HTTP_201_CREATED
)
def register_visitor(payload: UserRegister, db: Session = Depends(get_db)):
    # Check duplicate email
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check duplicate gov_id
    existing_profile = (
        db.query(VisitorProfile).filter(VisitorProfile.gov_id == payload.gov_id).first()
    )
    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Duplicate registration based on government-issued ID number.",
        )

    # Create User
    new_user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="visitor",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Simulate online ID verification (always verified for simulation)
    is_verified = True

    # Create Visitor Profile
    new_profile = VisitorProfile(
        user_id=new_user.id,
        full_name=payload.full_name,
        phone=payload.phone,
        gov_id=payload.gov_id,
        is_verified=is_verified,
        is_flagged=False,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return VisitorResponse(
        id=new_profile.id,
        email=new_user.email,
        full_name=new_profile.full_name,
        phone=new_profile.phone,
        gov_id=new_profile.gov_id,
        is_verified=new_profile.is_verified,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return TokenResponse(access_token=access_token, token_type="bearer", role=user.role)
