import logging
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from server.config import settings

logger = logging.getLogger(__name__)

# Handle SQLite vs Postgres connect args
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database tables idempotently."""
    # Import models here to ensure they are registered on Base.metadata
    from server import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    logger.info("Database initialized successfully.")


def seed_data(db: Session) -> None:
    """Seed sample game sessions, players, and scores if empty."""
    from server.models import GameSession, Player, ScoreEntry

    try:
        existing_session = db.query(GameSession).first()
        if not existing_session:
            # Create sample session
            sample_session = GameSession(
                game_name="Catan Championship", status="active"
            )
            db.add(sample_session)
            db.flush()

            # Create sample players
            alice = Player(session_id=sample_session.id, name="Alice")
            bob = Player(session_id=sample_session.id, name="Bob")
            charlie = Player(session_id=sample_session.id, name="Charlie")
            diana = Player(session_id=sample_session.id, name="Diana")
            db.add_all([alice, bob, charlie, diana])
            db.flush()

            # Create sample scores
            scores = [
                ScoreEntry(
                    session_id=sample_session.id,
                    player_id=alice.id,
                    points=15.0,
                    round_or_category="Round 1",
                ),
                ScoreEntry(
                    session_id=sample_session.id,
                    player_id=bob.id,
                    points=20.0,
                    round_or_category="Round 1",
                ),
                ScoreEntry(
                    session_id=sample_session.id,
                    player_id=charlie.id,
                    points=12.0,
                    round_or_category="Round 1",
                ),
                ScoreEntry(
                    session_id=sample_session.id,
                    player_id=diana.id,
                    points=18.0,
                    round_or_category="Round 1",
                ),
            ]
            db.add_all(scores)
            db.commit()
            logger.info("Sample seed data inserted.")
    except Exception as e:
        db.rollback()
        logger.warning(f"Seed data skipped or encountered error: {e}")
