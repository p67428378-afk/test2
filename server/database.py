from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from server.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if "sqlite" in settings.DATABASE_URL
    else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


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

    # Seed regular child user
    test_user = (
        db.query(models.User).filter(models.User.email == "test@example.com").first()
    )
    if not test_user:
        test_user = models.User(
            email="test@example.com",
            full_name="Test Child Learner",
            role="child",
            is_parent_verified=True,
            is_active=True,
            is_verified=True,
            hashed_password=get_password_hash("testpassword"),
            total_points=0,
        )
        db.add(test_user)
        db.flush()

    # Seed admin / parent user
    admin_user = (
        db.query(models.User).filter(models.User.email == "admin@example.com").first()
    )
    if not admin_user:
        admin_user = models.User(
            email="admin@example.com",
            full_name="Admin Parent",
            role="admin",
            is_parent_verified=True,
            is_active=True,
            is_verified=True,
            hashed_password=get_password_hash("adminpassword"),
            total_points=100,
        )
        db.add(admin_user)
        db.flush()

    # Seed initial habits if none exist
    if db.query(models.Habit).count() == 0:
        initial_habits = [
            models.Habit(
                category="Nutrition",
                title="Drank 4 Glasses of Water",
                description="Stay hydrated throughout the day!",
                points_value=10,
            ),
            models.Habit(
                category="Nutrition",
                title="Ate a Fresh Fruit or Vegetable",
                description="Fuel your body with vitamins!",
                points_value=15,
            ),
            models.Habit(
                category="Physical Activity",
                title="30 Minutes of Outdoor Play",
                description="Run, jump, and play outside!",
                points_value=20,
            ),
            models.Habit(
                category="Physical Activity",
                title="Morning Stretch Routine",
                description="Wake up your muscles with simple stretches.",
                points_value=10,
            ),
            models.Habit(
                category="Personal Hygiene",
                title="Brushed Teeth Morning & Night",
                description="Keep your smile bright and clean!",
                points_value=15,
            ),
            models.Habit(
                category="Personal Hygiene",
                title="Washed Hands Before Meals",
                description="Scrub away germs with soap and water.",
                points_value=10,
            ),
            models.Habit(
                category="Rest/Sleep",
                title="Slept 8+ Hours Last Night",
                description="Give your brain and body rest to grow.",
                points_value=20,
            ),
            models.Habit(
                category="Rest/Sleep",
                title="No Screen Time 1 Hour Before Bed",
                description="Relax your eyes and mind before sleeping.",
                points_value=15,
            ),
        ]
        for habit_item in initial_habits:
            db.add(habit_item)

    # Seed initial badges if none exist
    if db.query(models.Badge).count() == 0:
        initial_badges = [
            models.Badge(
                name="Starter Scout",
                description="Earned your first 10 health points!",
                required_points=10,
                icon_key="badge_scout",
            ),
            models.Badge(
                name="Habit Hero",
                description="Reached 50 total health habit points!",
                required_points=50,
                icon_key="badge_hero",
            ),
            models.Badge(
                name="Health Hero",
                description="Unlocked 100 health points milestone!",
                required_points=100,
                icon_key="badge_champion",
            ),
            models.Badge(
                name="Super Streak Star",
                description="Achieved 250 habit points!",
                required_points=250,
                icon_key="badge_star",
            ),
        ]
        for badge_item in initial_badges:
            db.add(badge_item)

    # Seed initial lessons if none exist
    if db.query(models.Lesson).count() == 0:
        initial_lessons = [
            models.Lesson(
                title="Why Water is Magic for Your Body",
                category="Nutrition",
                content="Water helps move nutrients, keeps your body cool, and gives you energy to play!",
                quiz_question="How many glasses of water should you aim to drink daily?",
                quiz_options="2 glasses,4-8 glasses,15 glasses,None",
                correct_answer="4-8 glasses",
                points_value=15,
            ),
            models.Lesson(
                title="The Power of Sleep",
                category="Rest/Sleep",
                content="Sleep helps your brain process everything you learned today and repairs your muscle tissues.",
                quiz_question="How many hours of sleep do kids need every night?",
                quiz_options="3 hours,5 hours,8-10 hours,20 hours",
                correct_answer="8-10 hours",
                points_value=15,
            ),
        ]
        for lesson_item in initial_lessons:
            db.add(lesson_item)

    try:
        db.commit()
    except Exception:
        db.rollback()
