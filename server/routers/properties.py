from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from server.database import get_db
from server.models import Property, PropertyImage, Broker
from server.schemas import PropertyCreate, PropertyUpdate, PropertyResponse
from server.dependencies import get_current_broker

router = APIRouter()


@router.get("/properties", response_model=List[PropertyResponse])
def get_properties(
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    bathrooms: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1),
    db: Session = Depends(get_db),
):
    query = db.query(Property)
    if location:
        query = query.filter(Property.location.icontains(location))
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if bedrooms is not None:
        query = query.filter(Property.bedrooms == bedrooms)
    if bathrooms is not None:
        query = query.filter(Property.bathrooms == bathrooms)

    return query.offset(skip).limit(limit).all()


@router.get("/properties/{property_id}", response_model=PropertyResponse)
def get_property(property_id: UUID, db: Session = Depends(get_db)):
    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_property


@router.post(
    "/properties", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED
)
def create_property(
    property_in: PropertyCreate,
    current_broker: Broker = Depends(get_current_broker),
    db: Session = Depends(get_db),
):
    db_property = Property(
        broker_id=current_broker.id,
        title=property_in.title,
        description=property_in.description,
        location=property_in.location,
        price=property_in.price,
        bedrooms=property_in.bedrooms,
        bathrooms=property_in.bathrooms,
    )
    db.add(db_property)
    db.commit()
    db.refresh(db_property)

    if property_in.image_urls:
        for url in property_in.image_urls:
            db_image = PropertyImage(property_id=db_property.id, image_url=url)
            db.add(db_image)
        db.commit()
        db.refresh(db_property)

    return db_property


@router.put("/properties/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: UUID,
    property_in: PropertyUpdate,
    current_broker: Broker = Depends(get_current_broker),
    db: Session = Depends(get_db),
):
    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    if db_property.broker_id != current_broker.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this listing"
        )

    update_data = property_in.dict(exclude_unset=True)
    image_urls = update_data.pop("image_urls", None)

    for key, value in update_data.items():
        setattr(db_property, key, value)

    if image_urls is not None:
        # Clear existing images and add new ones
        db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id
        ).delete()
        for url in image_urls:
            db_image = PropertyImage(property_id=property_id, image_url=url)
            db.add(db_image)

    db.commit()
    db.refresh(db_property)
    return db_property


@router.delete("/properties/{property_id}")
def delete_property(
    property_id: UUID,
    current_broker: Broker = Depends(get_current_broker),
    db: Session = Depends(get_db),
):
    db_property = db.query(Property).filter(Property.id == property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    if db_property.broker_id != current_broker.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this listing"
        )

    db.delete(db_property)
    db.commit()
    return {"detail": "Property deleted successfully"}
