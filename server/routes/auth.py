from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=schemas.TokenResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    guide = db.query(models.Guide).filter(models.Guide.email == request.email).first()
    if not guide or not auth.verify_password(request.password, guide.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials provided",
        )

    access_token = auth.create_access_token(data={"sub": guide.email})
    return {"access_token": access_token, "token_type": "bearer", "guide": guide}
