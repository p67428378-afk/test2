from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from server import models, schemas


def get_properties(
    db: Session, location: Optional[str] = None, skip: int = 0, limit: int = 20
):
    query = db.query(models.Property)
    if location:
        # Case-insensitive search on location
        query = query.filter(models.Property.location.ilike(f"%{location}%"))
    return query.offset(skip).limit(limit).all()


def get_property(db: Session, property_id: UUID):
    return db.query(models.Property).filter(models.Property.id == property_id).first()


def create_property(db: Session, property_in: schemas.PropertyCreate):
    db_property = models.Property(
        title=property_in.title,
        location=property_in.location,
        price=property_in.price,
        bedrooms=property_in.bedrooms,
        bathrooms=property_in.bathrooms,
        description=property_in.description,
    )
    db_property.image_urls = property_in.image_urls
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property


def create_contact(db: Session, contact_in: schemas.ContactCreate):
    db_contact = models.Contact(
        property_id=contact_in.property_id,
        user_name=contact_in.user_name,
        user_email=contact_in.user_email,
        message=contact_in.message,
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact
