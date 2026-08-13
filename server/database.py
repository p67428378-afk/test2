import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from server.config import settings

logger = logging.getLogger(__name__)

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


def seed_data(db):
    from server.models import User, UserRole, Tanker, TankerStatus
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    # Seed users
    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "role": UserRole.CUSTOMER,
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "role": UserRole.ADMIN,
        },
        {
            "email": "operator@example.com",
            "password": "operatorpassword",
            "role": UserRole.OPERATOR,
        },
        {
            "email": "driver@example.com",
            "password": "driverpassword",
            "role": UserRole.DRIVER,
        },
    ]

    for u_data in users_to_seed:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            user = User(
                email=u_data["email"],
                hashed_password=hash_password(u_data["password"]),
                role=u_data["role"],
                is_active=True,
            )
            db.add(user)

    # Seed tankers
    tankers_to_seed = [
        {
            "registration_number": "TK-1001",
            "capacity_liters": 5000,
            "status": TankerStatus.AVAILABLE,
        },
        {
            "registration_number": "TK-1002",
            "capacity_liters": 10000,
            "status": TankerStatus.AVAILABLE,
        },
        {
            "registration_number": "TK-1003",
            "capacity_liters": 1000,
            "status": TankerStatus.IN_MAINTENANCE,
        },
    ]

    for t_data in tankers_to_seed:
        existing = (
            db.query(Tanker)
            .filter(Tanker.registration_number == t_data["registration_number"])
            .first()
        )
        if not existing:
            tanker = Tanker(
                registration_number=t_data["registration_number"],
                capacity_liters=t_data["capacity_liters"],
                status=t_data["status"],
            )
            db.add(tanker)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.warning(f"Error seeding database: {e}")
