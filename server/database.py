from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models
    from server import models_painting
    from server.core.security import get_password_hash

    # 1. Seed test users idempotently
    test_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if not test_user:
        test_user = models.User(
            email="test@example.com",
            full_name="Test Customer",
            role="member",
            hashed_password=get_password_hash("testpassword"),
        )
        db.add(test_user)

    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        admin_user = models.User(
            email="admin@example.com",
            full_name="Gallery Admin",
            role="librarian",
            hashed_password=get_password_hash("adminpassword"),
        )
        db.add(admin_user)
    elif admin_user.role != "librarian":
        admin_user.role = "librarian"

    # 2. Seed Frame Options idempotently
    frame_options = [
        {
            "name": "Frameless Canvas Wrap",
            "material": "Canvas",
            "price_multiplier": Decimal("1.0000"),
            "flat_fee": Decimal("0.0000"),
        },
        {
            "name": "Natural Wood Frame",
            "material": "Solid Oak",
            "price_multiplier": Decimal("1.1500"),
            "flat_fee": Decimal("35.0000"),
        },
        {
            "name": "Matte Black Frame",
            "material": "Anodized Aluminum",
            "price_multiplier": Decimal("1.2000"),
            "flat_fee": Decimal("45.0000"),
        },
        {
            "name": "Metallic Floater Frame",
            "material": "Brushed Brass",
            "price_multiplier": Decimal("1.3000"),
            "flat_fee": Decimal("65.0000"),
        },
    ]

    for fo in frame_options:
        existing_fo = (
            db.query(models_painting.FrameOption)
            .filter(models_painting.FrameOption.name == fo["name"])
            .first()
        )
        if not existing_fo:
            db.add(models_painting.FrameOption(**fo))

    # 3. Seed Sample Paintings idempotently
    sample_paintings = [
        {
            "title": "Celestial Harmony",
            "description": "Vibrant abstract composition in cobalt blue and warm gold foil leaf.",
            "artist_name": "Elena Rostova",
            "medium": "Oil",
            "style": "Abstract",
            "base_price": Decimal("350.0000"),
            "is_configurable": True,
            "is_original_one_of_one": False,
            "stock_quantity": 25,
            "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
            "status": "ACTIVE",
        },
        {
            "title": "Autumn Solitude in Kyoto",
            "description": "1-of-1 original oil painting capturing serenity in Japanese maple gardens.",
            "artist_name": "Kenji Takahashi",
            "medium": "Oil",
            "style": "Landscape",
            "base_price": Decimal("1250.0000"),
            "is_configurable": False,
            "is_original_one_of_one": True,
            "stock_quantity": 1,
            "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
            "status": "ACTIVE",
        },
        {
            "title": "Ethereal Portrait No. 4",
            "description": "Modern acrylic portrait with soft muted pastel tones.",
            "artist_name": "Sophie Martin",
            "medium": "Acrylic",
            "style": "Portrait",
            "base_price": Decimal("280.0000"),
            "is_configurable": True,
            "is_original_one_of_one": False,
            "stock_quantity": 15,
            "image_url": "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
            "status": "ACTIVE",
        },
        {
            "title": "Urban Geometric Reflections",
            "description": "Modern mixed media artwork featuring sharp architectural silhouettes.",
            "artist_name": "Marcus Vance",
            "medium": "Mixed Media",
            "style": "Modern",
            "base_price": Decimal("420.0000"),
            "is_configurable": True,
            "is_original_one_of_one": False,
            "stock_quantity": 10,
            "image_url": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
            "status": "ACTIVE",
        },
    ]

    for p in sample_paintings:
        existing_p = (
            db.query(models_painting.Painting)
            .filter(models_painting.Painting.title == p["title"])
            .first()
        )
        if not existing_p:
            db.add(models_painting.Painting(**p))

    try:
        db.commit()
    except Exception:
        db.rollback()
