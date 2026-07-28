from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from server.config import settings

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
    from server.models import Base as ModelsBase

    ModelsBase.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import Role, User
    from server.auth import get_password_hash
    from sqlalchemy.exc import IntegrityError

    # Seed Roles
    roles_to_seed = ["Administrator", "Investigator", "Analyst"]
    role_objects = {}
    for role_name in roles_to_seed:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name)
            db.add(role)
            try:
                db.commit()
                db.refresh(role)
            except IntegrityError:
                db.rollback()
                role = db.query(Role).filter(Role.name == role_name).first()
        role_objects[role_name] = role

    # Seed Admin User
    admin_username = "admin@example.com"
    admin_user = db.query(User).filter(User.username == admin_username).first()
    if not admin_user:
        admin_user = User(
            username=admin_username,
            password_hash=get_password_hash("adminpassword"),
            role_id=role_objects["Administrator"].id,
        )
        db.add(admin_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()

    # Seed Regular User (Investigator)
    test_username = "test@example.com"
    test_user = db.query(User).filter(User.username == test_username).first()
    if not test_user:
        test_user = User(
            username=test_username,
            password_hash=get_password_hash("testpassword"),
            role_id=role_objects["Investigator"].id,
        )
        db.add(test_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()


def log_audit(db, user_id, action, details=None):
    from server.models import AuditLog

    audit = AuditLog(user_id=user_id, action=action, details=details)
    db.add(audit)
    try:
        db.commit()
    except Exception:
        db.rollback()


def log_chain_of_custody(db, evidence_id, user_id, action, details=None):
    from server.models import ChainOfCustodyLog

    log = ChainOfCustodyLog(
        evidence_id=evidence_id, user_id=user_id, action=action, details=details
    )
    db.add(log)
    try:
        db.commit()
    except Exception:
        db.rollback()
