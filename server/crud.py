from sqlalchemy.orm import Session
from server import models
from typing import Optional, List
from uuid import UUID


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
    otp.is_used = True
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
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# Zoo Visitor App CRUD


def get_animals(db: Session, name: Optional[str] = None) -> List[models.Animal]:
    query = db.query(models.Animal)
    if name:
        query = query.filter(models.Animal.name.ilike(f"%{name}%"))
    return query.all()


def get_animal_by_id(db: Session, animal_id: UUID) -> Optional[models.Animal]:
    return db.query(models.Animal).filter(models.Animal.id == str(animal_id)).first()


def get_enclosures(db: Session) -> List[models.Enclosure]:
    return db.query(models.Enclosure).all()


def get_facilities(db: Session) -> List[models.Facility]:
    return db.query(models.Facility).all()


def create_enclosure(
    db: Session,
    name: str,
    location_x: float,
    location_y: float,
    description: Optional[str] = None,
) -> models.Enclosure:
    db_enclosure = models.Enclosure(
        name=name, location_x=location_x, location_y=location_y, description=description
    )
    db.add(db_enclosure)
    db.commit()
    db.refresh(db_enclosure)
    return db_enclosure


def create_animal(
    db: Session,
    name: str,
    species: str,
    enclosure_id: UUID,
    status: str = "Active",
    habitat: Optional[str] = None,
    diet: Optional[str] = None,
    conservation_status: Optional[str] = None,
    image_url: Optional[str] = None,
    qr_code: Optional[str] = None,
) -> models.Animal:
    db_animal = models.Animal(
        name=name,
        species=species,
        enclosure_id=str(enclosure_id),
        status=status,
        habitat=habitat,
        diet=diet,
        conservation_status=conservation_status,
        image_url=image_url,
        qr_code=qr_code,
    )
    db.add(db_animal)
    db.commit()
    db.refresh(db_animal)
    return db_animal


def create_facility(
    db: Session, name: str, type: str, location_x: float, location_y: float
) -> models.Facility:
    db_facility = models.Facility(
        name=name, type=type, location_x=location_x, location_y=location_y
    )
    db.add(db_facility)
    db.commit()
    db.refresh(db_facility)
    return db_facility
