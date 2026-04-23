from sqlalchemy.orm import Session
from app.models.credit_card import CreditCard
from app.schemas.credit_card import CreditCardCreate

class CRUDCreditCard:
    def get_eligible(self, db: Session, *, min_credit_score: float, min_income: float) -> list[CreditCard]:
        return (
            db.query(CreditCard)
            .filter(
                CreditCard.min_credit_score <= min_credit_score,
                CreditCard.min_income <= min_income,
            )
            .all()
        )
    
    def create(self, db: Session, *, obj_in: CreditCardCreate) -> CreditCard:
        db_obj = CreditCard(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

credit_card = CRUDCreditCard()
