import os
import uuid
import hashlib
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

# If SQLite in-memory or file database
connect_args = {}
engine_kwargs = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if ":memory:" in DATABASE_URL or DATABASE_URL == "sqlite://":
        engine_kwargs["poolclass"] = StaticPool

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_password_hash(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return (
        hashlib.sha256(plain_password.encode("utf-8")).hexdigest() == hashed_password
    )


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from server import models  # Ensure models are loaded before create_all
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server import models

    # Check if test user already exists
    existing_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if existing_user:
        return

    try:
        # Create default test user
        test_user = models.User(
            id=str(uuid.uuid4()),
            email="test@example.com",
            full_name="Test User",
            hashed_password=get_password_hash("testpassword"),
            is_active=True,
        )
        db.add(test_user)

        # Create admin user
        admin_user = models.User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            full_name="Admin User",
            hashed_password=get_password_hash("adminpassword"),
            is_active=True,
        )
        db.add(admin_user)

        # Create partner users
        partner1 = models.User(
            id=str(uuid.uuid4()),
            email="partner1@example.com",
            full_name="Alice Partner",
            hashed_password=get_password_hash("testpassword"),
            is_active=True,
        )
        db.add(partner1)

        partner2 = models.User(
            id=str(uuid.uuid4()),
            email="partner2@example.com",
            full_name="Bob Partner",
            hashed_password=get_password_hash("testpassword"),
            is_active=True,
        )
        db.add(partner2)

        db.commit()

        # Seed Skills
        skill_python = models.Skill(
            id=str(uuid.uuid4()),
            name="Python Programming",
            category="Software Development",
        )
        skill_react = models.Skill(
            id=str(uuid.uuid4()),
            name="React Framework",
            category="Frontend Development",
        )
        skill_fastapi = models.Skill(
            id=str(uuid.uuid4()), name="FastAPI", category="Backend Development"
        )
        skill_spanish = models.Skill(
            id=str(uuid.uuid4()), name="Spanish Language", category="Languages"
        )
        skill_data = models.Skill(
            id=str(uuid.uuid4()), name="Data Analysis", category="Data Science"
        )

        skills = [skill_python, skill_react, skill_fastapi, skill_spanish, skill_data]
        for s in skills:
            db.add(s)
        db.commit()

        # Seed UserSkills
        # test_user teaches Python, wants React & Spanish
        us_test_teach_python = models.UserSkill(
            id=str(uuid.uuid4()),
            user_id=test_user.id,
            skill_id=skill_python.id,
            type="TEACH",
            proficiency="EXPERT",
            description="5+ years Python backend developer",
        )
        us_test_learn_react = models.UserSkill(
            id=str(uuid.uuid4()),
            user_id=test_user.id,
            skill_id=skill_react.id,
            type="LEARN",
            proficiency="BEGINNER",
            description="Want to learn React 18 for frontend",
        )
        us_test_learn_spanish = models.UserSkill(
            id=str(uuid.uuid4()),
            user_id=test_user.id,
            skill_id=skill_spanish.id,
            type="LEARN",
            proficiency="INTERMEDIATE",
            description="Conversational practice",
        )

        # partner1 (Alice) teaches React, wants Python
        us_p1_teach_react = models.UserSkill(
            id=str(uuid.uuid4()),
            user_id=partner1.id,
            skill_id=skill_react.id,
            type="TEACH",
            proficiency="EXPERT",
            description="Senior React engineer",
        )
        us_p1_learn_python = models.UserSkill(
            id=str(uuid.uuid4()),
            user_id=partner1.id,
            skill_id=skill_python.id,
            type="LEARN",
            proficiency="INTERMEDIATE",
            description="Looking to learn backend with Python",
        )

        # partner2 (Bob) teaches Spanish, wants Python
        us_p2_teach_spanish = models.UserSkill(
            id=str(uuid.uuid4()),
            user_id=partner2.id,
            skill_id=skill_spanish.id,
            type="TEACH",
            proficiency="EXPERT",
            description="Native Spanish speaker",
        )
        us_p2_learn_python = models.UserSkill(
            id=str(uuid.uuid4()),
            user_id=partner2.id,
            skill_id=skill_python.id,
            type="LEARN",
            proficiency="BEGINNER",
            description="Beginner programming learner",
        )

        user_skills = [
            us_test_teach_python,
            us_test_learn_react,
            us_test_learn_spanish,
            us_p1_teach_react,
            us_p1_learn_python,
            us_p2_teach_spanish,
            us_p2_learn_python,
        ]
        for us in user_skills:
            db.add(us)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
