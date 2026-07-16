from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from server.database import get_db
from server.models import Property, PropertyImage, User
from server.schemas import (
    PropertyCreate,
    PropertyUpdate,
    PropertyResponse,
    PropertyDetailResponse,
)
from server.auth import get_current_broker

router = APIRouter(prefix="/properties", tags=["Properties"])


@router.get("", response_model=List[PropertyResponse])
def list_properties(
    bathrooms: Optional[float] = None,
    bedrooms: Optional[int] = None,
    limit: int = Query(20, ge=1, le=100),
    location: Optional[str] = None,
    max_price: Optional[float] = None,
    min_price: Optional[float] = None,
    property_type: Optional[str] = None,
    skip: int = Query(0, ge=0),
    sort_by: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Property)

    if bathrooms is not None:
        query = query.filter(Property.bathrooms >= bathrooms)
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)
    if location:
        query = query.filter(Property.address.icontains(location))
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if property_type:
        query = query.filter(Property.property_type.iexact(property_type))
    if status:
        query = query.filter(Property.status.iexact(status))

    if sort_by == "price_asc":
        query = query.order_by(Property.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Property.price.desc())
    elif sort_by == "created_at_desc":
        query = query.order_by(Property.created_at.desc())
    else:
        query = query.order_by(Property.created_at.desc())

    properties = query.offset(skip).limit(limit).all()

    # Map images
    results = []
    for p in properties:
        img_urls = [img.image_url for img in p.images]
        results.append(
            PropertyResponse(
                id=p.id,
                address=p.address,
                price=float(p.price),
                property_type=p.property_type,
                status=p.status,
                bedrooms=p.bedrooms,
                bathrooms=p.bathrooms,
                description=p.description,
                broker_id=p.broker_id,
                created_at=p.created_at,
                images=img_urls,
            )
        )
    return results


@router.post("", response_model=PropertyResponse, status_code=201)
def create_property(
    prop_in: PropertyCreate,
    current_broker: User = Depends(get_current_broker),
    db: Session = Depends(get_db),
):
    db_prop = Property(
        address=prop_in.address,
        price=prop_in.price,
        property_type=prop_in.property_type,
        status=prop_in.status,
        bedrooms=prop_in.bedrooms,
        bathrooms=prop_in.bathrooms,
        description=prop_in.description,
        broker_id=current_broker.id,
    )
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)

    if prop_in.images:
        for img_url in prop_in.images:
            db_img = PropertyImage(property_id=db_prop.id, image_url=img_url)
            db.add(db_img)
        db.commit()
        db.refresh(db_prop)

    img_urls = [img.image_url for img in db_prop.images]
    return PropertyResponse(
        id=db_prop.id,
        address=db_prop.address,
        price=float(db_prop.price),
        property_type=db_prop.property_type,
        status=db_prop.status,
        bedrooms=db_prop.bedrooms,
        bathrooms=db_prop.bathrooms,
        description=db_prop.description,
        broker_id=db_prop.broker_id,
        created_at=db_prop.created_at,
        images=img_urls,
    )


@router.get("/{id}", response_model=PropertyDetailResponse)
def get_property(id: UUID, db: Session = Depends(get_db)):
    p = db.query(Property).filter(Property.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Property not found")

    img_urls = [img.image_url for img in p.images]
    return PropertyDetailResponse(
        id=p.id,
        address=p.address,
        price=float(p.price),
        property_type=p.property_type,
        status=p.status,
        bedrooms=p.bedrooms,
        bathrooms=p.bathrooms,
        description=p.description,
        created_at=p.created_at,
        images=img_urls,
        broker=p.broker,
    )


@router.put("/{id}", response_model=PropertyResponse)
def update_property(
    id: UUID,
    prop_in: PropertyUpdate,
    current_broker: User = Depends(get_current_broker),
    db: Session = Depends(get_db),
):
    p = db.query(Property).filter(Property.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Property not found")

    if p.broker_id != current_broker.id:
        raise HTTPException(
            status_code=403, detail="User is not the owner of this listing"
        )

    for field, value in prop_in.model_dump(exclude_unset=True).items():
        if field == "images":
            continue
        setattr(p, field, value)

    if prop_in.images is not None:
        # Clear old images and add new ones
        db.query(PropertyImage).filter(PropertyImage.property_id == p.id).delete()
        for img_url in prop_in.images:
            db_img = PropertyImage(property_id=p.id, image_url=img_url)
            db.add(db_img)

    db.commit()
    db.refresh(p)

    img_urls = [img.image_url for img in p.images]
    return PropertyResponse(
        id=p.id,
        address=p.address,
        price=float(p.price),
        property_type=p.property_type,
        status=p.status,
        bedrooms=p.bedrooms,
        bathrooms=p.bathrooms,
        description=p.description,
        broker_id=p.broker_id,
        created_at=p.created_at,
        images=img_urls,
    )


@router.delete("/{id}")
def delete_property(
    id: UUID,
    current_broker: User = Depends(get_current_broker),
    db: Session = Depends(get_db),
):
    p = db.query(Property).filter(Property.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Property not found")

    if p.broker_id != current_broker.id:
        raise HTTPException(
            status_code=403, detail="User is not the owner of this listing"
        )

    db.delete(p)
    db.commit()
    return {"detail": "Property deleted successfully"}
