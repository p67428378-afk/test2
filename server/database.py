import uuid
from datetime import datetime, timezone
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import StaticPool
from server.config import settings

Base = declarative_base()

# Engine setup
if settings.DATABASE_URL.startswith("sqlite"):
    if ":memory:" in settings.DATABASE_URL or settings.TESTING:
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False},
        )
else:
    engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    # Import all models to ensure they register on Base.metadata
    from server.models import User, Course, Enrollment, Assignment, Submission  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    from server.models import User, Course, Assignment, Enrollment
    from server.security import get_password_hash

    try:
        # Check or create default student test account
        student = db.query(User).filter(User.email == "test@example.com").first()
        if not student:
            student = User(
                id=str(uuid.uuid4()),
                email="test@example.com",
                hashed_password=get_password_hash("testpassword"),
                full_name="Alex Johnson",
                role="student",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(student)
            db.commit()
            db.refresh(student)

        # Check or create default admin/faculty test account
        faculty = db.query(User).filter(User.email == "admin@example.com").first()
        if not faculty:
            faculty = User(
                id=str(uuid.uuid4()),
                email="admin@example.com",
                hashed_password=get_password_hash("adminpassword"),
                full_name="Dr. Robert Smith",
                role="faculty",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(faculty)
            db.commit()
            db.refresh(faculty)

        # Pre-seed default courses if none exist
        existing_courses = db.query(Course).count()
        if existing_courses == 0:
            course1 = Course(
                id=str(uuid.uuid4()),
                course_code="CS101",
                title="Introduction to Computer Science",
                description="Fundamental concepts of programming, algorithms, and data structures.",
                instructor_id=faculty.id,
                semester="Fall 2026",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            course2 = Course(
                id=str(uuid.uuid4()),
                course_code="MATH201",
                title="Calculus II",
                description="Techniques of integration, infinite series, and parametric equations.",
                instructor_id=faculty.id,
                semester="Fall 2026",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            course3 = Course(
                id=str(uuid.uuid4()),
                course_code="ENG102",
                title="Academic Writing and Composition",
                description="Critical reading, analytical writing, and research methods.",
                instructor_id=faculty.id,
                semester="Fall 2026",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add_all([course1, course2, course3])
            db.commit()
            db.refresh(course1)
            db.refresh(course2)
            db.refresh(course3)

            # Pre-enroll test student in CS101 and MATH201
            enrollment1 = Enrollment(
                id=str(uuid.uuid4()),
                student_id=student.id,
                course_id=course1.id,
                enrolled_at=datetime.now(timezone.utc),
            )
            enrollment2 = Enrollment(
                id=str(uuid.uuid4()),
                student_id=student.id,
                course_id=course2.id,
                enrolled_at=datetime.now(timezone.utc),
            )
            db.add_all([enrollment1, enrollment2])

            # Seed an assignment for CS101
            assignment1 = Assignment(
                id=str(uuid.uuid4()),
                course_id=course1.id,
                title="Lab 4: Data Structures & Algorithms Implementation",
                description="Implement a Binary Search Tree and Hash Map in Python. Include unit tests and complexity analysis.",
                due_date=datetime(2026, 10, 15, 23, 59, 0, tzinfo=timezone.utc),
                max_points=100.0,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            assignment2 = Assignment(
                id=str(uuid.uuid4()),
                course_id=course2.id,
                title="Problem Set 5: Integration by Parts",
                description="Complete problems 1 through 15 from Chapter 7.",
                due_date=datetime(2026, 10, 20, 23, 59, 0, tzinfo=timezone.utc),
                max_points=100.0,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add_all([assignment1, assignment2])
            db.commit()

    except Exception:
        db.rollback()
