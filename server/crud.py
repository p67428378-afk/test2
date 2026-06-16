import uuid
import random
from typing import Optional, List
from sqlalchemy.orm import Session
from server import models, schemas

def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()

def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True  # type: ignore
    db.commit()
    db.refresh(otp)
    return otp

def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password  # type: ignore
    db.commit()
    db.refresh(user)
    return user

# --- Assortment Advisor CRUD ---

def seed_skus_if_empty(db: Session):
    from server.database import Base
    Base.metadata.create_all(bind=db.get_bind())
    if db.query(models.SKU).count() == 0:
        default_skus = [
            models.SKU(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa1"),
                name="Lay's Classic 13oz",
                weekly_sales=1240.00,
                profit_margin=24.00,
                days_of_supply=12,
                recommended_action="GROW"
            ),
            models.SKU(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa2"),
                name="Clover Valley Pretzels 16oz",
                weekly_sales=850.00,
                profit_margin=38.00,
                days_of_supply=18,
                recommended_action="MAINTAIN"
            ),
            models.SKU(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa3"),
                name="Oreo Double Stuf 15.3oz",
                weekly_sales=1100.00,
                profit_margin=22.00,
                days_of_supply=8,
                recommended_action="GROW"
            ),
            models.SKU(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa4"),
                name="Clover Valley Tortilla Chips",
                weekly_sales=620.00,
                profit_margin=42.00,
                days_of_supply=22,
                recommended_action="MAINTAIN"
            ),
            models.SKU(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa5"),
                name="Planters Peanuts 16oz",
                weekly_sales=410.00,
                profit_margin=18.00,
                days_of_supply=35,
                recommended_action="REDUCE"
            ),
            models.SKU(
                id=uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6"),
                name="Cheez-It Original 12.4oz",
                weekly_sales=950.00,
                profit_margin=20.00,
                days_of_supply=14,
                recommended_action="SWAP"
            )
        ]
        db.add_all(default_skus)
        db.commit()

def get_skus(db: Session, scenario: Optional[str] = None) -> List[models.SKU]:
    seed_skus_if_empty(db)
    skus = db.query(models.SKU).all()
    
    if not scenario:
        return skus
        
    scenario_lower = scenario.lower()
    for s in skus:
        if scenario_lower == "conservative":
            if s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa1"):
                s.recommended_action = "MAINTAIN"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa2"):
                s.recommended_action = "MAINTAIN"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa3"):
                s.recommended_action = "MAINTAIN"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa4"):
                s.recommended_action = "MAINTAIN"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa5"):
                s.recommended_action = "REDUCE"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6"):
                s.recommended_action = "REDUCE"  # type: ignore
        elif scenario_lower == "aggressive":
            if s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa1"):
                s.recommended_action = "GROW"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa2"):
                s.recommended_action = "GROW"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa3"):
                s.recommended_action = "GROW"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa4"):
                s.recommended_action = "GROW"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa5"):
                s.recommended_action = "SWAP"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6"):
                s.recommended_action = "SWAP"  # type: ignore
        else: # balanced or default
            if s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa1"):
                s.recommended_action = "GROW"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa2"):
                s.recommended_action = "MAINTAIN"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa3"):
                s.recommended_action = "GROW"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa4"):
                s.recommended_action = "MAINTAIN"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa5"):
                s.recommended_action = "REDUCE"  # type: ignore
            elif s.id == uuid.UUID("3fa85f64-5717-4562-b3fc-2c963f66afa6"):
                s.recommended_action = "SWAP"  # type: ignore
    return skus

def create_assortment_decision(db: Session, decision_in: schemas.DecisionCreateRequest) -> models.AssortmentDecision:
    from server.database import Base
    Base.metadata.create_all(bind=db.get_bind())
    audit_id = f"AUDIT-{random.randint(10000, 99999)}"
    
    db_decision = models.AssortmentDecision(
        scenario_name=decision_in.scenario_name,
        submitted_by=decision_in.submitted_by,
        audit_id=audit_id
    )
    db.add(db_decision)
    db.commit()
    db.refresh(db_decision)
    
    for item in decision_in.items:
        db_item = models.DecisionItem(
            decision_id=db_decision.id,
            sku_id=item.sku_id,
            action=item.action
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_decision)
    return db_decision
