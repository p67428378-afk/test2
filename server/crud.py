from sqlalchemy.orm import Session

from . import models


def get_policies(db: Session, skip: int = 0, limit: int = 100) -> list[models.Policy]:
    return db.query(models.Policy).offset(skip).limit(limit).all()
