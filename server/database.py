import os
from datetime import datetime, timezone
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# SQLite specific connect args
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """Dependency for providing database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database tables idempotently."""
    from server import models  # noqa: F401
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session) -> None:
    """Seed initial sample resume data idempotently."""
    from server.models import ResumeModel
    import uuid

    existing = db.query(ResumeModel).filter(ResumeModel.email == "jane.doe@example.com").first()
    if not existing:
        sample_resume = ResumeModel(
            id=str(uuid.uuid4()),
            user_name="Jane Doe",
            email="jane.doe@example.com",
            phone="+1-555-0199",
            portfolio_url="https://linkedin.com/in/janedoe",
            template_id="modern",
            experiences=[
                {
                    "company": "Tech Corp",
                    "role": "Senior Software Engineer",
                    "start_date": "2022-01",
                    "end_date": "Present",
                    "bullet_points": [
                        "Architected scalable microservices handling 10k RPS",
                        "Optimized SQL queries reducing latency by 35%",
                        "Led migration of legacy monolithic backend to FastAPI"
                    ]
                },
                {
                    "company": "Innovate Solutions",
                    "role": "Software Developer",
                    "start_date": "2019-06",
                    "end_date": "2021-12",
                    "bullet_points": [
                        "Built responsive frontend components with React and Tailwind",
                        "Implemented RESTful APIs for real-time document collaboration"
                    ]
                }
            ],
            education=[
                {
                    "institution": "State University",
                    "degree": "B.S. in Computer Science",
                    "completion_year": "2019"
                }
            ],
            skills=[
                "Python", "FastAPI", "SQLAlchemy", "React", "Tailwind CSS",
                "PostgreSQL", "Docker", "Git", "REST APIs", "CI/CD"
            ],
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        try:
            db.add(sample_resume)
            db.commit()
        except Exception:
            db.rollback()
