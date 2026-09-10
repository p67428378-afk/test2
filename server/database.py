import os
import uuid
from datetime import datetime, timezone

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./email_classification.db")

connect_args = {}
poolclass = None

if "sqlite" in DATABASE_URL:
    connect_args["check_same_thread"] = False
    if ":memory:" in DATABASE_URL:
        poolclass = StaticPool

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    poolclass=poolclass if poolclass else None,
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
    import server.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def seed_data(db):
    """Seed initial demonstration / test emails if the database is empty."""
    from server.models import Classification, Email

    if db.query(Email).first() is not None:
        return

    sample_emails = [
        {
            "sender": "ops-team@company.internal",
            "subject": "Urgent: Production Database Latency Spike",
            "body_text": "High priority alert: Production DB CPU utilization exceeded 95%. Immediate investigation required to prevent service degradation.",
            "source_type": "TEXT_ENTRY",
            "file_name": None,
            "ai_category": "Urgent",
            "confidence_score": 98.50,
        },
        {
            "sender": "sarah.manager@company.internal",
            "subject": "Q3 Project Milestone & Sprint Planning",
            "body_text": "Hi team, please review the attached roadmap for Q3 sprint delivery and submit your task estimates before Thursday standup.",
            "source_type": "TEXT_ENTRY",
            "file_name": None,
            "ai_category": "Work",
            "confidence_score": 94.20,
        },
        {
            "sender": "offers@e-deals-retail.com",
            "subject": "Exclusive 50% Weekend Sale - Don't Miss Out!",
            "body_text": "Flash deal! Get 50% discount on all premium electronics and accessories this weekend only. Click here to claim your coupon voucher.",
            "source_type": "TEXT_ENTRY",
            "file_name": None,
            "ai_category": "Promotional",
            "confidence_score": 96.80,
        },
        {
            "sender": "david.friend@gmail.com",
            "subject": "Dinner plans this Saturday?",
            "body_text": "Hey, let's catch up this weekend for dinner at the new Italian place downtown. Let me know what time works best for you!",
            "source_type": "TEXT_ENTRY",
            "file_name": None,
            "ai_category": "Personal",
            "confidence_score": 91.50,
        },
    ]

    for item in sample_emails:
        email_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        email_record = Email(
            id=email_id,
            sender=item["sender"],
            subject=item["subject"],
            body_text=item["body_text"],
            source_type=item["source_type"],
            file_name=item["file_name"],
            created_at=now,
            updated_at=now,
        )
        db.add(email_record)
        db.flush()

        classification_record = Classification(
            id=str(uuid.uuid4()),
            email_id=email_id,
            ai_category=item["ai_category"],
            confidence_score=item["confidence_score"],
            user_override_category=None,
            is_overridden=False,
            created_at=now,
            updated_at=now,
        )
        db.add(classification_record)

    try:
        db.commit()
    except Exception:
        db.rollback()
