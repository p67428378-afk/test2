import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

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
    from datetime import date
    from server.models import Resume, WorkExperience, EducationEntry, ResumeSkill

    # Check if any resume exists
    existing = db.query(Resume).filter_by(email="jane.doe@example.com").first()
    if not existing:
        sample_resume = Resume(
            title="Senior Full Stack Engineer",
            full_name="Jane Doe",
            email="jane.doe@example.com",
            phone="+1-555-0199",
            summary="Experienced Full Stack Developer with 7+ years of expertise in Python, FastAPI, React, and cloud architectures.",
        )
        db.add(sample_resume)
        db.flush()

        exp1 = WorkExperience(
            resume_id=sample_resume.id,
            company_name="Acme Corporation",
            role="Lead Backend Engineer",
            start_date=date(2021, 6, 1),
            end_date=None,
            is_current=True,
            description="Architected high-throughput microservices using FastAPI and PostgreSQL. Mentored junior developers and improved CI/CD deployment pipelines."
        )
        exp2 = WorkExperience(
            resume_id=sample_resume.id,
            company_name="TechStart Inc",
            role="Software Engineer",
            start_date=date(2018, 5, 1),
            end_date=date(2021, 5, 31),
            is_current=False,
            description="Developed customer-facing SPA web applications and REST APIs using Python and React."
        )
        db.add_all([exp1, exp2])

        edu1 = EducationEntry(
            resume_id=sample_resume.id,
            institution="State University",
            degree="B.S. in Computer Science",
            start_date=date(2014, 9, 1),
            end_date=date(2018, 5, 31)
        )
        db.add(edu1)

        skills = ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Tailwind CSS"]
        for s in skills:
            db.add(ResumeSkill(resume_id=sample_resume.id, skill_name=s))

        try:
            db.commit()
        except Exception:
            db.rollback()
