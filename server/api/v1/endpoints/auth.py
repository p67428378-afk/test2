from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas
from server.core import security
from server.core.deps import get_current_user, log_audit

router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login(login_req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_req.email).first()
    if not user or not security.verify_password(
        login_req.password, user.hashed_password
    ):
        log_audit(db, None, "LOGIN_FAILED", f"email:{login_req.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = security.create_access_token(subject=user.id, role=user.role)
    log_audit(db, user.id, "LOGIN_SUCCESS", f"user:{user.id}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me", response_model=schemas.UserRead)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
