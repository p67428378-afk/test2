from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from server.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {},
)
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
    # Idempotent seeding of some initial items if needed
    from server.models import Item
    import datetime

    # Check if we already have items
    if db.query(Item).count() == 0:
        item1 = Item(
            name="iPhone 13 Pro",
            description="Black iPhone 13 Pro with a blue silicone case, slightly scratched on the bottom left corner. Wallpaper is a mountain landscape.",
            category="Electronics",
            location="Student Union",
            report_date=datetime.datetime.utcnow(),
            contact_info="alex@example.com",
            status="lost",
        )
        item2 = Item(
            name="Leather Bi-fold Wallet",
            description="A classic brown leather bi-fold men's wallet.",
            category="Wallet",
            location="Library Cafe",
            report_date=datetime.datetime.utcnow(),
            contact_info="sam@example.com",
            status="found",
        )
        db.add(item1)
        db.add(item2)
        try:
            db.commit()
        except Exception:
            db.rollback()
