import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import Category, TouristPlace, MediaAsset, Review

    # Check if categories already exist
    existing_categories = db.query(Category).all()
    if existing_categories:
        return

    cat_hill = Category(
        id=str(uuid.uuid4()),
        name="Hill Stations",
        slug="hill-stations",
        description="Misty mountain peaks, tea plantations, and cool weather.",
    )
    cat_backwaters = Category(
        id=str(uuid.uuid4()),
        name="Backwaters",
        slug="backwaters",
        description="Scenic network of lagoons, lakes, and canals.",
    )
    cat_beaches = Category(
        id=str(uuid.uuid4()),
        name="Beaches",
        slug="beaches",
        description="Golden sand beaches, palm trees, and coastal sunsets.",
    )
    cat_cultural = Category(
        id=str(uuid.uuid4()),
        name="Cultural & Heritage Sites",
        slug="cultural-heritage",
        description="Historic monuments, colonial architecture, and traditional art forms.",
    )
    cat_wildlife = Category(
        id=str(uuid.uuid4()),
        name="Wildlife Sanctuaries",
        slug="wildlife-sanctuaries",
        description="Lush national parks, flora, fauna, and tiger reserves.",
    )

    db.add_all([cat_hill, cat_backwaters, cat_beaches, cat_cultural, cat_wildlife])
    db.commit()

    # Seed Tourist Places
    place_chembra = TouristPlace(
        id=str(uuid.uuid4()),
        category_id=cat_hill.id,
        title="Wayanad Chembra Peak",
        summary="Highest peak in Wayanad known for its heart-shaped lake.",
        description="Chembra Peak stands at 2,100 meters above sea level. It is famous for a heart-shaped lake, Hridaya Saras, midway to the peak.",
        district="Wayanad",
        state_region="Kerala",
        cover_image_url="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        latitude=11.5513,
        longitude=76.0894,
        best_time_to_visit="September to May",
        operating_hours="7 AM - 2 PM",
        entry_fee=75.0,
        permit_requirements="Passes issued by Forest Department at meppadi counter",
        avg_rating=4.8,
        review_count=1,
    )

    place_munnar = TouristPlace(
        id=str(uuid.uuid4()),
        category_id=cat_hill.id,
        title="Munnar Tea Gardens",
        summary="Expansive rolling tea plantations and mist-covered hills.",
        description="Munnar is a town and hill station located in the Idukki district of Kerala, famous for sprawling tea estates.",
        district="Idukki",
        state_region="Kerala",
        cover_image_url="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80",
        latitude=10.0889,
        longitude=77.0595,
        best_time_to_visit="September to March",
        operating_hours="6 AM - 6 PM",
        entry_fee=0.0,
        permit_requirements="None",
        avg_rating=4.7,
        review_count=1,
    )

    place_alleppey = TouristPlace(
        id=str(uuid.uuid4()),
        category_id=cat_backwaters.id,
        title="Alleppey Backwaters",
        summary="Cruising houseboats through scenic palm-fringed backwaters.",
        description="Alappuzha (Alleppey) is known as the Venice of the East, renowned for houseboat cruises along serene canals.",
        district="Alappuzha",
        state_region="Kerala",
        cover_image_url="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        latitude=9.4981,
        longitude=76.3388,
        best_time_to_visit="November to February",
        operating_hours="24 Hours",
        entry_fee=0.0,
        permit_requirements="Houseboat rentals booked separately",
        avg_rating=4.9,
        review_count=1,
    )

    place_kovalam = TouristPlace(
        id=str(uuid.uuid4()),
        category_id=cat_beaches.id,
        title="Kovalam Beach",
        summary="Famous crescent-shaped beach with iconic lighthouse views.",
        description="Kovalam is an internationally renowned beach town with three adjacent crescent beaches.",
        district="Thiruvananthapuram",
        state_region="Kerala",
        cover_image_url="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        latitude=8.4004,
        longitude=76.9787,
        best_time_to_visit="September to March",
        operating_hours="24 Hours",
        entry_fee=0.0,
        permit_requirements="None",
        avg_rating=4.6,
        review_count=1,
    )

    place_fort_kochi = TouristPlace(
        id=str(uuid.uuid4()),
        category_id=cat_cultural.id,
        title="Fort Kochi",
        summary="Historic coastal town known for Chinese fishing nets and art.",
        description="Fort Kochi blends Dutch, Portuguese, and British colonial influences with famous Chinese fishing nets along the coast.",
        district="Ernakulam",
        state_region="Kerala",
        cover_image_url="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        latitude=9.9658,
        longitude=76.2421,
        best_time_to_visit="October to March",
        operating_hours="24 Hours",
        entry_fee=0.0,
        permit_requirements="None",
        avg_rating=4.5,
        review_count=1,
    )

    place_periyar = TouristPlace(
        id=str(uuid.uuid4()),
        category_id=cat_wildlife.id,
        title="Periyar Wildlife Sanctuary",
        summary="Protected sanctuary home to wild elephants and tiger reserve.",
        description="Periyar National Park and Wildlife Sanctuary is a protected area near Thekkady in Idukki district.",
        district="Idukki",
        state_region="Kerala",
        cover_image_url="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
        latitude=9.4679,
        longitude=77.1428,
        best_time_to_visit="October to February",
        operating_hours="6 AM - 6 PM",
        entry_fee=150.0,
        permit_requirements="Boating ticket purchased at entrance",
        avg_rating=4.7,
        review_count=1,
    )

    db.add_all(
        [
            place_chembra,
            place_munnar,
            place_alleppey,
            place_kovalam,
            place_fort_kochi,
            place_periyar,
        ]
    )
    db.commit()

    # Seed Media Assets & Sample Reviews
    m1 = MediaAsset(
        id=str(uuid.uuid4()),
        place_id=place_chembra.id,
        media_type="image",
        url="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        caption="Heart-shaped lake on Chembra Peak trek",
    )
    r1 = Review(
        id=str(uuid.uuid4()),
        place_id=place_chembra.id,
        user_name="Anand Kumar",
        rating=5,
        comment="Incredible trek and stunning heart-shaped lake view. Highly recommended!",
    )

    r2 = Review(
        id=str(uuid.uuid4()),
        place_id=place_alleppey.id,
        user_name="Sarah Jenkins",
        rating=5,
        comment="Cruising houseboats through scenic palm-fringed backwaters was serene and magical.",
    )

    r3 = Review(
        id=str(uuid.uuid4()),
        place_id=place_kovalam.id,
        user_name="Deepak Nair",
        rating=5,
        comment="Sunset view is breathtaking, clean beach with great seafood options.",
    )

    db.add_all([m1, r1, r2, r3])
    db.commit()
