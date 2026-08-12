from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from server.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in settings.DATABASE_URL
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
    from server import models
    from server.core.security import get_password_hash

    accounts = [
        ("test@example.com", "testpassword", "Test Customer", "CUSTOMER"),
        ("admin@example.com", "adminpassword", "Admin User", "ADMIN"),
        ("operator@example.com", "operatorpassword", "Laundry Operator", "OPERATOR"),
        ("driver@example.com", "driverpassword", "Delivery Driver", "DRIVER"),
    ]

    for email, password, name, role in accounts:
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            user = models.User(
                email=email,
                full_name=name,
                role=role,
                hashed_password=get_password_hash(password),
                is_active=True,
            )
            db.add(user)

    try:
        db.commit()
    except Exception:
        db.rollback()
