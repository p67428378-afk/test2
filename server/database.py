import os
import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/app.db")

# For SQLite, we need to allow multithreading
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
    # Import models here to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.models import User, Habit, UserProgress, HabitLog
    from server.auth import get_password_hash

    # 1. Seed Users
    # Parent User (Admin)
    parent = db.query(User).filter(User.username == "sarah_parent").first()
    if not parent:
        parent = User(
            id=str(uuid.uuid4()),
            username="sarah_parent",
            email="admin@example.com",
            hashed_password=get_password_hash("adminpassword"),
            role="parent",
            is_active=True,
            is_verified=True,
        )
        db.add(parent)
        db.commit()
        db.refresh(parent)

    # Child User (Regular)
    child = db.query(User).filter(User.username == "timmy").first()
    if not child:
        child = User(
            id=str(uuid.uuid4()),
            username="timmy",
            email="test@example.com",
            hashed_password=get_password_hash("testpassword"),
            role="child",
            parent_id=parent.id,
            is_active=True,
            is_verified=True,
        )
        db.add(child)
        db.commit()
        db.refresh(child)

    # 2. Seed User Progress for Child
    progress = db.query(UserProgress).filter(UserProgress.user_id == child.id).first()
    if not progress:
        progress = UserProgress(
            id=str(uuid.uuid4()),
            user_id=child.id,
            total_stars=120,  # Match Figma design default
            current_streak=5,  # Match Figma design default
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(progress)
        db.commit()

    # 3. Seed Habits
    default_habits = [
        {
            "name": "Brush Teeth",
            "description": "Brush your teeth in the morning and at night.",
            "icon": "🪥",
            "points": 10,
            "is_active": True,
        },
        {
            "name": "Wash Hands",
            "description": "Wash your hands with soap and water.",
            "icon": "🧼",
            "points": 10,
            "is_active": True,
        },
        {
            "name": "Eat Veggies",
            "description": "Eat healthy vegetables with your meals.",
            "icon": "🥕",
            "points": 10,
            "is_active": True,
        },
        {
            "name": "Sleep on Time",
            "description": "Go to bed on time to get a good night's sleep.",
            "icon": "🌙",
            "points": 10,
            "is_active": True,
        },
    ]

    for h_data in default_habits:
        habit = db.query(Habit).filter(Habit.name == h_data["name"]).first()
        if not habit:
            habit = Habit(
                id=str(uuid.uuid4()),
                name=h_data["name"],
                description=h_data["description"],
                icon=h_data["icon"],
                points=h_data["points"],
                is_active=h_data["is_active"],
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(habit)
    db.commit()

    # 4. Seed a habit log for yesterday for Timmy so his 5-day streak is valid
    # Let's find the first habit
    habit = db.query(Habit).first()
    if habit:
        yesterday = datetime.now(timezone.utc) - timedelta(days=1)
        log = (
            db.query(HabitLog)
            .filter(HabitLog.user_id == child.id, HabitLog.habit_id == habit.id)
            .first()
        )
        if not log:
            log = HabitLog(
                id=str(uuid.uuid4()),
                user_id=child.id,
                habit_id=habit.id,
                completed_at=yesterday,
            )
            db.add(log)
            db.commit()
