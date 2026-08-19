from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from server.config import settings

# Handle SQLite connect args
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL, connect_args=connect_args, pool_pre_ping=True
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
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()


def seed_data(db: Session):
    from server.models.user import User
    from server.models.category import Category
    from server.security import get_password_hash

    # Seed Default Categories
    default_categories = [
        {
            "name": "HVAC",
            "description": "Heating, ventilation, and air conditioning maintenance",
        },
        {
            "name": "Plumbing",
            "description": "Pipes, drains, faucets, and water heater servicing",
        },
        {
            "name": "Electrical",
            "description": "Wiring, fixtures, outlets, and electrical panel checks",
        },
        {"name": "General", "description": "General household repair and maintenance"},
        {
            "name": "Landscaping",
            "description": "Lawn care, garden maintenance, and outdoor upkeep",
        },
    ]

    for cat_data in default_categories:
        existing_cat = (
            db.query(Category).filter(Category.name == cat_data["name"]).first()
        )
        if not existing_cat:
            cat = Category(name=cat_data["name"], description=cat_data["description"])
            db.add(cat)

    try:
        db.commit()
    except Exception:
        db.rollback()

    # Seed Default Users
    default_users = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User",
            "role": "member",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Admin User",
            "role": "admin",
        },
        {
            "email": "john@example.com",
            "password": "password123",
            "full_name": "John",
            "role": "member",
        },
        {
            "email": "alice@example.com",
            "password": "password123",
            "full_name": "Alice",
            "role": "member",
        },
    ]

    for user_data in default_users:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing_user:
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                full_name=user_data["full_name"],
                role=user_data["role"],
            )
            db.add(user)

    try:
        db.commit()
    except Exception:
        db.rollback()
