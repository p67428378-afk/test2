
from . import models, schemas
from sqlalchemy.orm import Session
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def calculate_premium(request: schemas.PremiumCalculationRequest) -> float:
    base_premium = 500.0

    # Calculate NCB discount
    if request.ncb_years >= 5:
        ncb_discount = 0.5
    elif request.ncb_years >= 1:
        ncb_discount = 0.2
    else:
        ncb_discount = 0.0

    premium_after_ncb = base_premium * (1 - ncb_discount)

    # Calculate vehicle multiplier
    vehicle_multiplier = 1.0
    if request.vehicle_risk_factor < 1.0:
        vehicle_multiplier = 0.8
    elif request.vehicle_risk_factor > 1.2:
        vehicle_multiplier = 1.6
    
    final_premium = premium_after_ncb * vehicle_multiplier

    return round(final_premium, 2)
