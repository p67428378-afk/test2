import os
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from sqlalchemy.exc import IntegrityError

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def hash_password(password: str) -> str:
    pw_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User, Category

    # Default categories to seed for new/seeded users
    default_expense_cats = [
        "Food & Dining",
        "Transportation",
        "Housing & Rent",
        "Entertainment",
        "Utilities",
        "Healthcare",
        "Shopping",
    ]
    default_income_cats = [
        "Salary",
        "Freelance",
        "Investments",
        "Other Income",
    ]

    test_accounts = [
        {"email": "test@example.com", "password": "testpassword", "role": "user"},
        {"email": "admin@example.com", "password": "adminpassword", "role": "admin"},
    ]

    for acc in test_accounts:
        existing_user = db.query(User).filter(User.email == acc["email"]).first()
        if not existing_user:
            hashed_pw = hash_password(acc["password"])
            user = User(
                email=acc["email"],
                hashed_password=hashed_pw,
                is_active=True,
                role=acc["role"],
            )
            try:
                db.add(user)
                db.commit()
                db.refresh(user)

                # Seed initial categories for the user
                for cat_name in default_expense_cats:
                    cat = Category(user_id=user.id, name=cat_name, type="Expense")
                    db.add(cat)
                for cat_name in default_income_cats:
                    cat = Category(user_id=user.id, name=cat_name, type="Income")
                    db.add(cat)
                db.commit()
            except IntegrityError:
                db.rollback()
