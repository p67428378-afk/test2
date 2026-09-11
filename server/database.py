import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User, Vendor
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    # Seed default users
    users_to_seed = [
        (
            "test@example.com",
            "testpassword",
            "Test Procurement Admin",
            "procurement_admin",
        ),
        ("admin@example.com", "adminpassword", "Admin User", "procurement_admin"),
        ("legal@example.com", "legalpassword", "Legal Approver", "legal_approver"),
        (
            "finance@example.com",
            "financepassword",
            "Finance Approver",
            "finance_approver",
        ),
        ("vendor@example.com", "vendorpassword", "Vendor Rep", "vendor_representative"),
    ]

    for email, password, name, role in users_to_seed:
        existing = db.query(User).filter(User.email == email).first()
        if not existing:
            hashed_pw = pwd_context.hash(password)
            user = User(
                email=email,
                hashed_password=hashed_pw,
                full_name=name,
                role=role,
                is_active=True,
            )
            db.add(user)

    # Seed a default vendor
    default_vendor_name = "Acme Corp"
    vendor = db.query(Vendor).filter(Vendor.name == default_vendor_name).first()
    if not vendor:
        vendor = Vendor(
            name=default_vendor_name,
            contact_email="vendor@example.com",
            status="Active",
        )
        db.add(vendor)

    try:
        db.commit()
    except Exception:
        db.rollback()
