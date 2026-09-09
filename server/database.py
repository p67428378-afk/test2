import os
import uuid
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    # Import models here to ensure metadata registration
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    from server.models import Product

    existing_count = db.query(Product).count()
    if existing_count > 0:
        return

    sample_products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Wireless Noise-Canceling Headphones",
            "description": "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
            "category": "electronics",
            "price": 199.99,
            "rating": 4.8,
            "tags": ["audio", "wireless", "anc", "bluetooth", "portable"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Smart Fitness Watch Pro",
            "description": "Waterproof smartwatch with heart rate monitoring, GPS, and OLED display.",
            "category": "electronics",
            "price": 149.50,
            "rating": 4.6,
            "tags": ["fitness", "wearable", "smartwatch", "wireless", "waterproof"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "4K Ultra HD Action Camera",
            "description": "Rugged action camera supporting 60fps 4K video recording with stabilization.",
            "category": "electronics",
            "price": 289.00,
            "rating": 4.5,
            "tags": ["camera", "video", "4k", "portable", "waterproof"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Mechanical Gaming Keyboard RGB",
            "description": "Tactile mechanical switches with customizable RGB backlighting and wrist rest.",
            "category": "electronics",
            "price": 89.99,
            "rating": 4.7,
            "tags": ["gaming", "keyboard", "rgb", "mechanical", "accessories"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Clean Code & Architecture Guide",
            "description": "A comprehensive handbook for modern software craftsmanship and architecture patterns.",
            "category": "books",
            "price": 39.99,
            "rating": 4.9,
            "tags": ["programming", "architecture", "educational", "software"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "The Art of Machine Learning",
            "description": "In-depth guide to modern deep learning, neural networks, and recommendation systems.",
            "category": "books",
            "price": 49.95,
            "rating": 4.8,
            "tags": ["ai", "machine-learning", "educational", "data-science"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Ergonomic Office Mesh Chair",
            "description": "High back breathable mesh desk chair with adjustable lumbar support and armrests.",
            "category": "home",
            "price": 219.00,
            "rating": 4.4,
            "tags": ["furniture", "ergonomic", "office", "comfortable"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Adjustable Standing Desk Converter",
            "description": "Dual-tier sit-stand desk riser with smooth gas spring height adjustment.",
            "category": "home",
            "price": 179.99,
            "rating": 4.6,
            "tags": ["furniture", "office", "standing-desk", "ergonomic"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Performance Running Shoes",
            "description": "Lightweight breathable running shoes with responsive foam cushioning.",
            "category": "clothing",
            "price": 119.99,
            "rating": 4.5,
            "tags": ["fitness", "running", "shoes", "sportswear", "breathable"],
            "in_stock": True,
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Thermal Insulated Travel Mug",
            "description": "Stainless steel vacuum insulated tumbler keeping drinks hot for 12 hours.",
            "category": "home",
            "price": 24.99,
            "rating": 4.7,
            "tags": ["kitchen", "travel", "insulated", "portable"],
            "in_stock": True,
        },
    ]

    for item in sample_products:
        p = Product(**item)
        db.add(p)

    try:
        db.commit()
    except Exception:
        db.rollback()
