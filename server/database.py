"""Database configuration and session management."""

import os
from collections.abc import Generator
from datetime import datetime, timezone

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# SQLite configuration adjustments
connect_args = {}
poolclass = None
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if ":memory:" in DATABASE_URL or os.getenv("TESTING") == "true":
        poolclass = StaticPool

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    poolclass=poolclass if poolclass else None,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Provide a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(target_engine=None):
    """Create all database tables."""
    from server import models  # noqa: F401

    bind_engine = target_engine or engine
    Base.metadata.create_all(bind=bind_engine)


def seed_data(db: Session):
    """Seed sample products for the catalog and recommendation testing."""
    from server.models import Product

    existing_count = db.query(Product).count()
    if existing_count > 0:
        return

    sample_products = [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "name": "Wireless Noise-Canceling Headphones",
            "description": "High fidelity audio with active noise cancellation and 30hr battery life.",
            "category": "electronics",
            "price": 199.99,
            "rating": 4.8,
            "tags": ["audio", "wireless", "anc", "bluetooth", "gadgets"],
            "in_stock": True,
        },
        {
            "id": "123e4567-e89b-12d3-a456-426614174001",
            "name": "Ultra-Slim 4K Laptop",
            "description": "14-inch OLED display, 16GB RAM, 512GB NVMe SSD, lightweight aluminum chassis.",
            "category": "electronics",
            "price": 899.99,
            "rating": 4.7,
            "tags": ["computer", "portable", "work", "wireless", "gadgets"],
            "in_stock": True,
        },
        {
            "id": "123e4567-e89b-12d3-a456-426614174002",
            "name": "Smart Fitness Watch",
            "description": "Heart rate monitor, GPS tracking, sleep analyzer, water-resistant up to 50m.",
            "category": "electronics",
            "price": 129.50,
            "rating": 4.3,
            "tags": ["fitness", "wearable", "health", "smart", "wireless"],
            "in_stock": True,
        },
        {
            "id": "123e4567-e89b-12d3-a456-426614174003",
            "name": "Deep Learning & AI Handbook",
            "description": "Comprehensive guide to neural networks, machine learning algorithms, and real-world AI applications.",
            "category": "books",
            "price": 49.99,
            "rating": 4.9,
            "tags": ["ai", "python", "education", "books", "data"],
            "in_stock": True,
        },
        {
            "id": "123e4567-e89b-12d3-a456-426614174004",
            "name": "Ergonomic Mechanical Keyboard",
            "description": "Custom mechanical switches, RGB backlighting, wrist rest, programmable macro keys.",
            "category": "electronics",
            "price": 89.00,
            "rating": 4.5,
            "tags": ["keyboard", "gaming", "accessories", "wireless"],
            "in_stock": True,
        },
        {
            "id": "123e4567-e89b-12d3-a456-426614174005",
            "name": "Running Performance Shoes",
            "description": "Breathable mesh, responsive foam cushioning, durable rubber traction outsole.",
            "category": "apparel",
            "price": 110.00,
            "rating": 4.2,
            "tags": ["fitness", "running", "shoes", "sport"],
            "in_stock": True,
        },
        {
            "id": "123e4567-e89b-12d3-a456-426614174006",
            "name": "Budget Wired Earphones",
            "description": "Standard 3.5mm jack in-ear headphones with built-in microphone.",
            "category": "electronics",
            "price": 19.99,
            "rating": 3.8,
            "tags": ["audio", "budget", "wired"],
            "in_stock": True,
        },
    ]

    for item in sample_products:
        p = Product(
            id=item["id"],
            name=item["name"],
            description=item["description"],
            category=item["category"],
            price=item["price"],
            rating=item["rating"],
            tags=item["tags"],
            in_stock=item["in_stock"],
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(p)

    try:
        db.commit()
    except Exception:
        db.rollback()
