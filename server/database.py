import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from server.models import Base, User, Feedback, SentimentAnalysis, FeedbackTopic

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./feedback.db")

# For SQLite, check_same_thread=False is needed
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session = None):
    close_after = False
    if db is None:
        db = SessionLocal()
        close_after = True

    try:
        # Import password hashing function safely
        from server.auth import get_password_hash

        # 1. Seed regular test user
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                password_hash=get_password_hash("testpassword"),
                role="user",
                is_active=True,
            )
            db.add(test_user)

        # 2. Seed admin user
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@example.com",
                password_hash=get_password_hash("adminpassword"),
                role="admin",
                is_active=True,
            )
            db.add(admin_user)

        db.commit()

        # 3. Seed sample feedback items if none exist
        feedback_count = db.query(Feedback).count()
        if feedback_count == 0:
            sample_feedbacks = [
                {
                    "text": "The new dashboard layout is super clean and fast!",
                    "rating": 5,
                    "email": "alice@example.com",
                    "sentiment": "Positive",
                    "score": 0.94,
                    "topics": [("UI Usability & Design", 0.95)],
                },
                {
                    "text": "Checkout timed out twice when paying via credit card.",
                    "rating": 2,
                    "email": "bob@enterprise.org",
                    "sentiment": "Negative",
                    "score": 0.88,
                    "topics": [("Payment Gateway Slowness", 0.92)],
                },
                {
                    "text": "Support team resolved my issue within 10 minutes.",
                    "rating": 4,
                    "email": "carol@startup.io",
                    "sentiment": "Positive",
                    "score": 0.79,
                    "topics": [("Customer Support Response", 0.90)],
                },
                {
                    "text": "Would be nice to export reports directly to CSV.",
                    "rating": 3,
                    "email": "david@corp.com",
                    "sentiment": "Neutral",
                    "score": 0.52,
                    "topics": [("Feature Requests", 0.85)],
                },
            ]

            for item in sample_feedbacks:
                fb = Feedback(
                    feedback_text=item["text"],
                    rating=item["rating"],
                    customer_email=item["email"],
                    analysis_status="Analyzed",
                )
                db.add(fb)
                db.flush()

                sa = SentimentAnalysis(
                    feedback_id=fb.id,
                    sentiment=item["sentiment"],
                    score=item["score"],
                    raw_llm_response="Rule-based pre-seeded analysis",
                )
                db.add(sa)

                for topic_name, conf in item["topics"]:
                    tp = FeedbackTopic(
                        feedback_id=fb.id,
                        topic_name=topic_name,
                        confidence=conf,
                    )
                    db.add(tp)

            db.commit()

    except Exception:
        db.rollback()
    finally:
        if close_after:
            db.close()
