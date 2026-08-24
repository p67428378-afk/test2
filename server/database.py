from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from server.config import settings
from server.models import Base, User, Quote
from sqlalchemy.exc import IntegrityError

# Create engine
# For SQLite, we use connect_args={"check_same_thread": False}
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    # Import here to avoid circular dependency
    from server.auth import get_password_hash

    # Seed regular user
    test_user_email = "test@example.com"
    test_user = db.query(User).filter(User.email == test_user_email).first()
    if not test_user:
        try:
            hashed_pw = get_password_hash("testpassword")
            test_user = User(
                email=test_user_email, full_name="Test User", hashed_password=hashed_pw
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
        except IntegrityError:
            db.rollback()
            test_user = db.query(User).filter(User.email == test_user_email).first()

    # Seed admin user
    admin_user_email = "admin@example.com"
    admin_user = db.query(User).filter(User.email == admin_user_email).first()
    if not admin_user:
        try:
            hashed_pw = get_password_hash("adminpassword")
            admin_user = User(
                email=admin_user_email,
                full_name="Admin User",
                hashed_password=hashed_pw,
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
        except IntegrityError:
            db.rollback()
            admin_user = db.query(User).filter(User.email == admin_user_email).first()

    # Seed default quotes
    default_quotes = [
        {
            "text": "The only limit to our realization of tomorrow is our doubts of today.",
            "author": "Franklin D. Roosevelt",
            "category": "Motivation",
        },
        {
            "text": "Act as if what you do makes a difference. It does.",
            "author": "William James",
            "category": "Wisdom",
        },
        {
            "text": "Be yourself; everyone else is already taken.",
            "author": "Oscar Wilde",
            "category": "Wisdom",
        },
        {
            "text": "In the middle of difficulty lies opportunity.",
            "author": "Albert Einstein",
            "category": "Motivation",
        },
        {
            "text": "The only way to do great work is to love what you do.",
            "author": "Steve Jobs",
            "category": "Inspiration",
        },
    ]

    for q in default_quotes:
        existing_quote = db.query(Quote).filter(Quote.text == q["text"]).first()
        if not existing_quote:
            try:
                quote_obj = Quote(
                    text=q["text"], author=q["author"], category=q["category"]
                )
                db.add(quote_obj)
                db.commit()
            except IntegrityError:
                db.rollback()
