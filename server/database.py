from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from server.core.config import settings

# For SQLite, we need connect_args={"check_same_thread": False}
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
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


def seed_data(db):
    from server.models import User, Category, DietaryTag
    from server.core.security import get_password_hash
    from sqlalchemy.exc import IntegrityError

    # Seed Categories
    categories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"]
    for cat_name in categories:
        existing = db.query(Category).filter(Category.name == cat_name).first()
        if not existing:
            db.add(Category(name=cat_name))

    # Seed Dietary Tags
    tags = ["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Low-Carb"]
    for tag_name in tags:
        existing = db.query(DietaryTag).filter(DietaryTag.name == tag_name).first()
        if not existing:
            db.add(DietaryTag(name=tag_name))

    try:
        db.commit()
    except IntegrityError:
        db.rollback()

    # Seed Users
    users_to_seed = [
        {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpassword",
            "role": "member",
        },
        {
            "username": "adminuser",
            "email": "admin@example.com",
            "password": "adminpassword",
            "role": "admin",
        },
    ]

    for u_data in users_to_seed:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            hashed_pw = get_password_hash(u_data["password"])
            new_user = User(
                username=u_data["username"],
                email=u_data["email"],
                hashed_password=hashed_pw,
                role=u_data["role"],
            )
            db.add(new_user)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
