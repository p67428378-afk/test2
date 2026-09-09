import os
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

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


def get_password_hash(password: str) -> str:
    pw_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode("utf-8")


def init_db():
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User, Species, UserPlant, CareLog

    # 1. Seed regular test user
    test_user = db.query(User).filter(User.email == "test@example.com").first()
    if not test_user:
        test_user = User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            full_name="Test User",
            role="user",
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(test_user)
        db.flush()

    # 2. Seed admin test user
    admin_user = db.query(User).filter(User.email == "admin@example.com").first()
    if not admin_user:
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword"),
            full_name="Admin User",
            role="admin",
            is_active=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(admin_user)
        db.flush()

    # 3. Seed botanical species catalog
    default_species = [
        {
            "common_name": "Monstera Deliciosa",
            "scientific_name": "Monstera deliciosa",
            "sunlight_requirement": "Bright Indirect Light",
            "light_requirement": "Bright Indirect Light",
            "humidity_requirement": "High humidity (60%+)",
            "humidity_target_pct": 65,
            "temp_min_f": 65,
            "temp_max_f": 85,
            "recommended_watering_days": 7,
            "default_watering_interval_days": 7,
            "default_fertilization_interval_days": 30,
            "description": "Popular tropical plant with iconic split leaves. Thrives in warm, humid spaces with bright filtered light.",
            "is_custom": False,
        },
        {
            "common_name": "Snake Plant",
            "scientific_name": "Dracaena trifasciata",
            "sunlight_requirement": "Low Light / Shade",
            "light_requirement": "Low Light / Shade",
            "humidity_requirement": "Low / Moderate (30-50%)",
            "humidity_target_pct": 40,
            "temp_min_f": 55,
            "temp_max_f": 85,
            "recommended_watering_days": 14,
            "default_watering_interval_days": 14,
            "default_fertilization_interval_days": 60,
            "description": "Hardy architectural succulent with upright sword-like foliage. Extremely drought-tolerant and adaptable.",
            "is_custom": False,
        },
        {
            "common_name": "Fiddle-Leaf Fig",
            "scientific_name": "Ficus lyrata",
            "sunlight_requirement": "Direct Sunlight",
            "light_requirement": "Bright Direct / Filtered Light",
            "humidity_requirement": "Medium to High (50-60%)",
            "humidity_target_pct": 55,
            "temp_min_f": 60,
            "temp_max_f": 80,
            "recommended_watering_days": 7,
            "default_watering_interval_days": 7,
            "default_fertilization_interval_days": 30,
            "description": "Stunning indoor tree with large violin-shaped leaves. Needs consistent light and steady watering routine.",
            "is_custom": False,
        },
        {
            "common_name": "Golden Pothos",
            "scientific_name": "Epipremnum aureum",
            "sunlight_requirement": "Medium Indirect Light",
            "light_requirement": "Medium Indirect Light",
            "humidity_requirement": "Moderate (40-60%)",
            "humidity_target_pct": 50,
            "temp_min_f": 60,
            "temp_max_f": 85,
            "recommended_watering_days": 7,
            "default_watering_interval_days": 7,
            "default_fertilization_interval_days": 30,
            "description": "Fast-growing trailing vine with heart-shaped variegated leaves. Great for hanging baskets or shelves.",
            "is_custom": False,
        },
        {
            "common_name": "ZZ Plant",
            "scientific_name": "Zamioculcas zamiifolia",
            "sunlight_requirement": "Low Light / Shade",
            "light_requirement": "Low Light / Shade",
            "humidity_requirement": "Low / Moderate (30-50%)",
            "humidity_target_pct": 40,
            "temp_min_f": 60,
            "temp_max_f": 80,
            "recommended_watering_days": 14,
            "default_watering_interval_days": 14,
            "default_fertilization_interval_days": 60,
            "description": "Indestructible glossy foliage plant with thick rhizomes that store water. Tolerates low light and drought.",
            "is_custom": False,
        },
        {
            "common_name": "Peace Lily",
            "scientific_name": "Spathiphyllum wallisii",
            "sunlight_requirement": "Medium Indirect Light",
            "light_requirement": "Medium Indirect Light",
            "humidity_requirement": "High humidity (60%+)",
            "humidity_target_pct": 60,
            "temp_min_f": 65,
            "temp_max_f": 80,
            "recommended_watering_days": 5,
            "default_watering_interval_days": 5,
            "default_fertilization_interval_days": 30,
            "description": "Lush tropical plant with elegant white blooms (spathes). Droops dramatically to signal when thirsty.",
            "is_custom": False,
        },
    ]

    species_map = {}
    for spec_info in default_species:
        existing = (
            db.query(Species)
            .filter(Species.common_name == spec_info["common_name"])
            .first()
        )
        if not existing:
            species_obj = Species(
                id=str(uuid.uuid4()),
                common_name=spec_info["common_name"],
                scientific_name=spec_info["scientific_name"],
                sunlight_requirement=spec_info["sunlight_requirement"],
                light_requirement=spec_info["light_requirement"],
                humidity_requirement=spec_info["humidity_requirement"],
                humidity_target_pct=spec_info["humidity_target_pct"],
                temp_min_f=spec_info["temp_min_f"],
                temp_max_f=spec_info["temp_max_f"],
                recommended_watering_days=spec_info["recommended_watering_days"],
                default_watering_interval_days=spec_info[
                    "default_watering_interval_days"
                ],
                default_fertilization_interval_days=spec_info[
                    "default_fertilization_interval_days"
                ],
                description=spec_info["description"],
                is_custom=False,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(species_obj)
            db.flush()
            species_map[spec_info["common_name"]] = species_obj
        else:
            species_map[spec_info["common_name"]] = existing

    # 4. Seed sample plants for test user if none exist
    user_plants_count = (
        db.query(UserPlant).filter(UserPlant.user_id == test_user.id).count()
    )
    if user_plants_count == 0:
        now = datetime.now(timezone.utc)
        monstera_species = species_map.get("Monstera Deliciosa")
        snake_species = species_map.get("Snake Plant")
        fiddle_species = species_map.get("Fiddle-Leaf Fig")
        pothos_species = species_map.get("Golden Pothos")

        sample_plants = [
            {
                "nickname": "Fernie Monstera",
                "species_id": monstera_species.id if monstera_species else None,
                "location": "Living Room",
                "photo_url": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
                "status": "Active",
                "watering_interval_days": 7,
                "fertilization_interval_days": 30,
                "last_watered_at": now - timedelta(days=9),
                "next_water_due": now - timedelta(days=2),  # Overdue
                "last_fertilized_at": now - timedelta(days=20),
                "next_fertilize_due": now + timedelta(days=10),
                "notifications_enabled": True,
            },
            {
                "nickname": "Sunny Fig",
                "species_id": fiddle_species.id if fiddle_species else None,
                "location": "Sunroom",
                "photo_url": "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
                "status": "Active",
                "watering_interval_days": 7,
                "fertilization_interval_days": 30,
                "last_watered_at": now - timedelta(days=7),
                "next_water_due": now,  # Due today
                "last_fertilized_at": now - timedelta(days=15),
                "next_fertilize_due": now + timedelta(days=15),
                "notifications_enabled": True,
            },
            {
                "nickname": "Desk Pothos",
                "species_id": pothos_species.id if pothos_species else None,
                "location": "Office",
                "photo_url": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80",
                "status": "Active",
                "watering_interval_days": 5,
                "fertilization_interval_days": 30,
                "last_watered_at": now - timedelta(days=5),
                "next_water_due": now,  # Due today
                "last_fertilized_at": now - timedelta(days=10),
                "next_fertilize_due": now + timedelta(days=20),
                "notifications_enabled": True,
            },
            {
                "nickname": "Bedroom Snake",
                "species_id": snake_species.id if snake_species else None,
                "location": "Bedroom",
                "photo_url": "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=600&q=80",
                "status": "Active",
                "watering_interval_days": 14,
                "fertilization_interval_days": 60,
                "last_watered_at": now - timedelta(days=4),
                "next_water_due": now + timedelta(days=10),  # Upcoming
                "last_fertilized_at": now - timedelta(days=30),
                "next_fertilize_due": now + timedelta(days=30),
                "notifications_enabled": True,
            },
        ]

        for p_data in sample_plants:
            plant_id = str(uuid.uuid4())
            plant_obj = UserPlant(
                id=plant_id,
                user_id=test_user.id,
                species_id=p_data["species_id"],
                nickname=p_data["nickname"],
                location=p_data["location"],
                photo_url=p_data["photo_url"],
                status=p_data["status"],
                watering_interval_days=p_data["watering_interval_days"],
                fertilization_interval_days=p_data["fertilization_interval_days"],
                last_watered_at=p_data["last_watered_at"],
                next_water_due=p_data["next_water_due"],
                last_fertilized_at=p_data["last_fertilized_at"],
                next_fertilize_due=p_data["next_fertilize_due"],
                notifications_enabled=p_data["notifications_enabled"],
                created_at=now,
                updated_at=now,
            )
            db.add(plant_obj)
            db.flush()

            # Add initial care log
            care_log = CareLog(
                id=str(uuid.uuid4()),
                plant_id=plant_id,
                care_type="WATERING",
                performed_at=p_data["last_watered_at"],
                notes="Initial watering upon garden setup.",
                created_at=now,
            )
            db.add(care_log)

    db.commit()
