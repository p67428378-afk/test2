import os
import uuid
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_data(db):
    from server.models import Chocolate

    if db.query(Chocolate).count() > 0:
        return

    sample_chocolates = [
        Chocolate(
            id=str(uuid.uuid4()),
            title="Madagascar Single-Origin 72%",
            description="Single-origin dark chocolate with vibrant citrus, raspberry, and wild floral notes sourced from the Sambirano Valley.",
            cocoa_percentage=72,
            origin_region="Madagascar",
            flavor_notes="Floral, Fruity, Citrus",
            dietary_flags="Vegan, Organic",
            price=12.00,
            stock_quantity=20,
            is_heat_sensitive=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        Chocolate(
            id=str(uuid.uuid4()),
            title="Ecuadorian Dark Truffle (85% Cocoa)",
            description="Rich and complex dark chocolate crafted with Arriba Nacional cocoa beans, featuring espresso and dark cherry notes.",
            cocoa_percentage=85,
            origin_region="Ecuador",
            flavor_notes="Floral, Espresso, Dark Cherry",
            dietary_flags="Vegan, Dairy-Free",
            price=14.50,
            stock_quantity=15,
            is_heat_sensitive=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        Chocolate(
            id=str(uuid.uuid4()),
            title="Assorted Exotic Truffles",
            description="Handcrafted ganache truffles infused with pink peppercorn, passionfruit, and smoked sea salt.",
            cocoa_percentage=65,
            origin_region="South America",
            flavor_notes="Nutty, Spicy, Fruity",
            dietary_flags="Organic",
            price=35.00,
            stock_quantity=10,
            is_heat_sensitive=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        Chocolate(
            id=str(uuid.uuid4()),
            title="Single Estate Chuao Venezuelan 70%",
            description="Legendary Chuao cacao offering hints of roasted almonds, molasses, and ripe plums.",
            cocoa_percentage=70,
            origin_region="Venezuela",
            flavor_notes="Nutty, Caramel, Plum",
            dietary_flags="Vegan, Dairy-Free, Organic",
            price=16.00,
            stock_quantity=3,
            is_heat_sensitive=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        Chocolate(
            id=str(uuid.uuid4()),
            title="Ghanaian Milk Chocolate & Sea Salt 55%",
            description="Creamy whole milk chocolate elevated with flaky sea salt crystals.",
            cocoa_percentage=55,
            origin_region="Ghana",
            flavor_notes="Nutty, Caramel",
            dietary_flags="Organic",
            price=9.50,
            stock_quantity=25,
            is_heat_sensitive=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        Chocolate(
            id=str(uuid.uuid4()),
            title="Peruvian Criollo Raw Dark 100%",
            description="Unroasted pure Criollo cocoa offering intense earthy notes and wild floral undertones.",
            cocoa_percentage=100,
            origin_region="Peru",
            flavor_notes="Floral, Earthy, Spicy",
            dietary_flags="Vegan, Dairy-Free, Organic",
            price=18.00,
            stock_quantity=8,
            is_heat_sensitive=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
        Chocolate(
            id=str(uuid.uuid4()),
            title="Ecuador Single-Estate Limited Reserve 90%",
            description="Ultra-rare micro-batch vintage chocolate bar from a private estate. Rich oak and spice.",
            cocoa_percentage=90,
            origin_region="Ecuador-Single Estate",
            flavor_notes="Spicy, Oak, Blackberry",
            dietary_flags="Vegan, Organic",
            price=22.00,
            stock_quantity=0,
            is_heat_sensitive=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        ),
    ]

    try:
        db.add_all(sample_chocolates)
        db.commit()
    except Exception:
        db.rollback()


def init_db():
    from server.models import Chocolate, Cart, CartItem, Order, OrderItem  # noqa: F401

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_data(db)
