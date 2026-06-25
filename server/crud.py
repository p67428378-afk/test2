from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from server import models, schemas


# Existing CRUD operations
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
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
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password  # type: ignore
    db.commit()
    db.refresh(user)
    return user


# New CRUD operations for Pencil Showcase
def get_categories(db: Session) -> List[models.Category]:
    return db.query(models.Category).all()


def get_category_by_name(db: Session, name: str) -> Optional[models.Category]:
    return db.query(models.Category).filter(models.Category.name == name).first()


def create_category(db: Session, category: schemas.CategoryCreate) -> models.Category:
    db_category = models.Category(
        name=category.name,
        description=category.description,
        image_url=category.image_url,
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def get_pencil(db: Session, pencil_id: UUID) -> Optional[models.Pencil]:
    return db.query(models.Pencil).filter(models.Pencil.id == pencil_id).first()


def get_pencils(
    db: Session,
    category: Optional[str] = None,
    hardness: Optional[str] = None,
    material: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
):
    query = db.query(models.Pencil)

    if category:
        # Try to parse as UUID first, otherwise filter by category name
        try:
            category_uuid = UUID(category)
            query = query.join(models.Pencil.categories).filter(
                models.Category.id == category_uuid
            )
        except ValueError:
            query = query.join(models.Pencil.categories).filter(
                models.Category.name.ilike(f"%{category}%")
            )

    if hardness:
        query = query.filter(models.Pencil.hardness.ilike(f"%{hardness}%"))

    if material:
        query = query.filter(models.Pencil.material.ilike(f"%{material}%"))

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return items, total


def create_pencil(db: Session, pencil: schemas.PencilCreate) -> models.Pencil:
    db_pencil = models.Pencil(
        name=pencil.name,
        description=pencil.description,
        price=pencil.price,
        hardness=pencil.hardness,
        material=pencil.material,
        core_diameter=pencil.core_diameter,
        length=pencil.length,
        shape=pencil.shape,
        eraser=pencil.eraser,
        image_url=pencil.image_url,
        images=pencil.images,
    )
    if pencil.category_ids:
        categories = (
            db.query(models.Category)
            .filter(models.Category.id.in_(pencil.category_ids))
            .all()
        )
        db_pencil.categories = categories

    db.add(db_pencil)
    db.commit()
    db.refresh(db_pencil)
    return db_pencil
