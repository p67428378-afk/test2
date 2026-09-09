import os
import uuid
from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import IntegrityError
from server.models import Base, User, Species

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

# For SQLite, ensure check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    # 1. Seed Default Users
    users_to_seed = [
        {
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User",
            "role": "user",
        },
        {
            "email": "admin@example.com",
            "password": "adminpassword",
            "full_name": "Admin User",
            "role": "admin",
        },
    ]

    for user_info in users_to_seed:
        existing = db.query(User).filter(User.email == user_info["email"]).first()
        if not existing:
            hashed = pwd_context.hash(user_info["password"])
            user = User(
                id=str(uuid.uuid4()),
                email=user_info["email"],
                hashed_password=hashed,
                full_name=user_info["full_name"],
                is_active=True,
                role=user_info["role"],
            )
            try:
                db.add(user)
                db.commit()
            except IntegrityError:
                db.rollback()

    # 2. Seed Species Catalog
    species_catalog = [
        {
            "common_name": "Monstera Deliciosa",
            "scientific_name": "Monstera deliciosa",
            "sunlight_requirement": "Bright Indirect",
            "humidity_requirement": "Moderate to High (60-80%)",
            "recommended_watering_days": 7,
            "description": "Famous for its natural leaf-holes, the Swiss Cheese Plant is a stunning tropical houseplant that thrives in warm, humid spaces.",
        },
        {
            "common_name": "Fiddle Leaf Fig",
            "scientific_name": "Ficus lyrata",
            "sunlight_requirement": "Bright Indirect",
            "humidity_requirement": "Moderate (50-65%)",
            "recommended_watering_days": 10,
            "description": "A popular indoor tree featuring broad, violin-shaped foliage that loves abundant filtered sunshine.",
        },
        {
            "common_name": "Snake Plant",
            "scientific_name": "Sansevieria trifasciata",
            "sunlight_requirement": "Low to Bright Indirect",
            "humidity_requirement": "Low to Average (30-50%)",
            "recommended_watering_days": 14,
            "description": "An exceptionally hardy succulent with upright architectural leaves, tolerant of neglect and varied lighting.",
        },
        {
            "common_name": "Golden Pothos",
            "scientific_name": "Epipremnum aureum",
            "sunlight_requirement": "Medium to Low Indirect",
            "humidity_requirement": "Average (40-60%)",
            "recommended_watering_days": 7,
            "description": "A fast-growing trailing vine with heart-shaped variegated green and yellow leaves, ideal for hanging baskets.",
        },
        {
            "common_name": "Peace Lily",
            "scientific_name": "Spathiphyllum wallisii",
            "sunlight_requirement": "Medium to Low Indirect",
            "humidity_requirement": "High (60-80%)",
            "recommended_watering_days": 5,
            "description": "Graceful flowering indoor plant known for deep glossy green leaves and elegant white spathe blooms.",
        },
        {
            "common_name": "Spider Plant",
            "scientific_name": "Chlorophytum comosum",
            "sunlight_requirement": "Bright to Moderate Indirect",
            "humidity_requirement": "Average (40-60%)",
            "recommended_watering_days": 7,
            "description": "Adaptable arching houseplant producing charming offshoot plantlets, great for beginners and pet-friendly homes.",
        },
        {
            "common_name": "ZZ Plant",
            "scientific_name": "Zamioculcas zamiifolia",
            "sunlight_requirement": "Low to Medium Indirect",
            "humidity_requirement": "Low (30-50%)",
            "recommended_watering_days": 14,
            "description": "Indestructible indoor plant with glossy, waxy leaves and thick rhizomes that store water during droughts.",
        },
        {
            "common_name": "Rubber Tree",
            "scientific_name": "Ficus elastica",
            "sunlight_requirement": "Bright Indirect",
            "humidity_requirement": "Moderate (50-60%)",
            "recommended_watering_days": 7,
            "description": "Dramatic indoor ornamental tree featuring thick, shiny burgundy-green oval leaves.",
        },
    ]

    for sp in species_catalog:
        existing = (
            db.query(Species).filter(Species.common_name == sp["common_name"]).first()
        )
        if not existing:
            new_sp = Species(
                id=str(uuid.uuid4()),
                common_name=sp["common_name"],
                scientific_name=sp["scientific_name"],
                sunlight_requirement=sp["sunlight_requirement"],
                humidity_requirement=sp["humidity_requirement"],
                recommended_watering_days=sp["recommended_watering_days"],
                description=sp["description"],
            )
            try:
                db.add(new_sp)
                db.commit()
            except IntegrityError:
                db.rollback()
