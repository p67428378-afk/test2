import math
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from server.models import Category, TouristPlace, MediaAsset, Review
from server.schemas import (
    CategoryCreate,
    TouristPlaceCreate,
    MediaAssetCreate,
    ReviewCreate,
    NearbyAttractionResponse,
)


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0  # Radius of earth in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# Categories CRUD
def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[Category]:
    return db.query(Category).offset(skip).limit(limit).all()


def get_category(db: Session, category_id: str) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_slug(db: Session, slug: str) -> Optional[Category]:
    return db.query(Category).filter(Category.slug == slug).first()


def create_category(db: Session, category: CategoryCreate) -> Category:
    db_cat = Category(
        id=str(uuid.uuid4()),
        name=category.name,
        slug=category.slug,
        description=category.description,
    )
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat


# TouristPlaces CRUD
def get_tourist_places(
    db: Session,
    search: Optional[str] = None,
    district: Optional[str] = None,
    category_id: Optional[str] = None,
    best_time_to_visit: Optional[str] = None,
    min_fee: Optional[float] = None,
    max_fee: Optional[float] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[TouristPlace]:
    query = db.query(TouristPlace)

    if category_id:
        query = query.filter(TouristPlace.category_id == category_id)

    if district:
        query = query.filter(TouristPlace.district.ilike(f"%{district}%"))

    if best_time_to_visit:
        query = query.filter(
            TouristPlace.best_time_to_visit.ilike(f"%{best_time_to_visit}%")
        )

    if min_fee is not None:
        query = query.filter(TouristPlace.entry_fee >= min_fee)

    if max_fee is not None:
        query = query.filter(TouristPlace.entry_fee <= max_fee)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                TouristPlace.title.ilike(search_pattern),
                TouristPlace.summary.ilike(search_pattern),
                TouristPlace.description.ilike(search_pattern),
                TouristPlace.district.ilike(search_pattern),
            )
        )

    return query.offset(skip).limit(limit).all()


def get_tourist_place(db: Session, place_id: str) -> Optional[TouristPlace]:
    return (
        db.query(TouristPlace)
        .options(
            joinedload(TouristPlace.category),
            joinedload(TouristPlace.media_assets),
            joinedload(TouristPlace.reviews),
        )
        .filter(TouristPlace.id == place_id)
        .first()
    )


def create_tourist_place(db: Session, place: TouristPlaceCreate) -> TouristPlace:
    db_place = TouristPlace(
        id=str(uuid.uuid4()),
        category_id=place.category_id,
        title=place.title,
        summary=place.summary,
        description=place.description,
        district=place.district,
        state_region=place.state_region,
        cover_image_url=place.cover_image_url,
        latitude=place.latitude,
        longitude=place.longitude,
        best_time_to_visit=place.best_time_to_visit,
        operating_hours=place.operating_hours,
        entry_fee=place.entry_fee,
        permit_requirements=place.permit_requirements,
        avg_rating=0.0,
        review_count=0,
    )
    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place


def get_nearby_attractions(
    db: Session, place_id: str, radius_km: float = 50.0
) -> List[NearbyAttractionResponse]:
    source_place = db.query(TouristPlace).filter(TouristPlace.id == place_id).first()
    if (
        not source_place
        or source_place.latitude is None
        or source_place.longitude is None
    ):
        return []

    other_places = (
        db.query(TouristPlace)
        .filter(
            TouristPlace.id != place_id,
            TouristPlace.latitude.isnot(None),
            TouristPlace.longitude.isnot(None),
        )
        .all()
    )

    nearby = []
    for p in other_places:
        dist = haversine_distance(
            source_place.latitude, source_place.longitude, p.latitude, p.longitude
        )
        if dist <= radius_km:
            nearby.append(
                NearbyAttractionResponse(
                    id=p.id,
                    title=p.title,
                    district=p.district,
                    cover_image_url=p.cover_image_url,
                    latitude=p.latitude,
                    longitude=p.longitude,
                    entry_fee=p.entry_fee,
                    avg_rating=p.avg_rating,
                    distance_km=round(dist, 2),
                )
            )

    nearby.sort(key=lambda x: x.distance_km)
    return nearby


# MediaAssets CRUD
def create_media_asset(db: Session, media: MediaAssetCreate) -> MediaAsset:
    db_media = MediaAsset(
        id=str(uuid.uuid4()),
        place_id=media.place_id,
        media_type=media.media_type,
        url=media.url,
        caption=media.caption,
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media


# Reviews CRUD
def get_reviews_by_place(db: Session, place_id: str) -> List[Review]:
    return db.query(Review).filter(Review.place_id == place_id).all()


def create_review(db: Session, review: ReviewCreate) -> Review:
    db_review = Review(
        id=str(uuid.uuid4()),
        place_id=review.place_id,
        user_name=review.user_name,
        rating=review.rating,
        comment=review.comment,
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)

    # Recalculate average rating and review count for the tourist place
    place = db.query(TouristPlace).filter(TouristPlace.id == review.place_id).first()
    if place:
        all_reviews = db.query(Review).filter(Review.place_id == review.place_id).all()
        place.review_count = len(all_reviews)
        if place.review_count > 0:
            place.avg_rating = round(
                sum(r.rating for r in all_reviews) / place.review_count, 1
            )
        db.commit()
        db.refresh(place)

    return db_review
