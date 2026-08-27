"""Database connection, session management, and data seeding."""

import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from server.config import DATABASE_URL
from server.models import Base, Podcast, Episode

logger = logging.getLogger(__name__)

# Engine configuration
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency for obtaining a SQLAlchemy session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_data(db: Session) -> None:
    """Seed sample podcasts and episodes idempotently."""
    try:
        existing_count = db.query(Podcast).count()
        if existing_count > 0:
            logger.info("Database already seeded with %d podcasts", existing_count)
            return

        now = datetime.now(timezone.utc)

        # 1. Tech Pulse Daily
        tech_podcast = Podcast(
            id=str(uuid.uuid4()),
            title="Tech Pulse Daily",
            description="Daily deep dive into technology, software architecture, autonomous AI agents, and cloud systems.",
            author="Jane Developer",
            cover_image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
            category="Technology",
            total_subscribers=14200,
            created_at=now - timedelta(days=60),
            updated_at=now - timedelta(days=60),
        )
        db.add(tech_podcast)
        db.flush()

        episodes_tech = [
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=tech_podcast.id,
                title="Episode 42: The Future of AI Agents",
                description="Comprehensive overview of autonomous software agents, tool-augmented LLMs, and multi-agent workflows.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                duration_seconds=2340,
                episode_number=42,
                publish_date=now - timedelta(days=1),
                created_at=now - timedelta(days=1),
                updated_at=now - timedelta(days=1),
            ),
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=tech_podcast.id,
                title="Episode 41: Building Scalable Microservices with FastAPI",
                description="Deep dive into asynchronous Python microservice architectures, dependency injection, and Pydantic v2.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                duration_seconds=1820,
                episode_number=41,
                publish_date=now - timedelta(days=8),
                created_at=now - timedelta(days=8),
                updated_at=now - timedelta(days=8),
            ),
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=tech_podcast.id,
                title="Episode 40: Cloud Native Data Architectures",
                description="Exploring distributed SQL, PostgreSQL on GCP Cloud SQL, and caching strategies for high throughput.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                duration_seconds=2100,
                episode_number=40,
                publish_date=now - timedelta(days=15),
                created_at=now - timedelta(days=15),
                updated_at=now - timedelta(days=15),
            ),
        ]
        for ep in episodes_tech:
            db.add(ep)

        # 2. Business Forward
        business_podcast = Podcast(
            id=str(uuid.uuid4()),
            title="Business Forward",
            description="Interviews with industry leaders, startup founders, venture capitalists, and market strategists.",
            author="Alex Morgan",
            cover_image_url="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60",
            category="Business",
            total_subscribers=28000,
            created_at=now - timedelta(days=90),
            updated_at=now - timedelta(days=90),
        )
        db.add(business_podcast)
        db.flush()

        episodes_biz = [
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=business_podcast.id,
                title="Episode 88: Scaling from Seed to Series B",
                description="Actionable frameworks for early-stage company scaling, product-market fit metrics, and fundraising.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                duration_seconds=2750,
                episode_number=88,
                publish_date=now - timedelta(days=3),
                created_at=now - timedelta(days=3),
                updated_at=now - timedelta(days=3),
            ),
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=business_podcast.id,
                title="Episode 87: Modern Corporate Strategy in the AI Era",
                description="How enterprise organizations are transforming their core business models and operating strategies with AI.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                duration_seconds=2400,
                episode_number=87,
                publish_date=now - timedelta(days=10),
                created_at=now - timedelta(days=10),
                updated_at=now - timedelta(days=10),
            ),
        ]
        for ep in episodes_biz:
            db.add(ep)

        # 3. Comedy Corner
        comedy_podcast = Podcast(
            id=str(uuid.uuid4()),
            title="Comedy Corner Weekly",
            description="Hilarious banter, stand-up comedian spotlights, and comedic takes on pop culture and modern life.",
            author="Sam Taylor & Friends",
            cover_image_url="https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=60",
            category="Comedy",
            total_subscribers=52000,
            created_at=now - timedelta(days=120),
            updated_at=now - timedelta(days=120),
        )
        db.add(comedy_podcast)
        db.flush()

        episodes_comedy = [
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=comedy_podcast.id,
                title="Episode 105: The Improv Disaster",
                description="Unfiltered stories from the world of underground standup comedy and hilarious live show mishaps.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
                duration_seconds=3120,
                episode_number=105,
                publish_date=now - timedelta(days=2),
                created_at=now - timedelta(days=2),
                updated_at=now - timedelta(days=2),
            ),
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=comedy_podcast.id,
                title="Episode 104: Office Antics and Awkward Moments",
                description="Laugh-out-loud commentary on remote work blunders, virtual meeting fails, and everyday absurdities.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
                duration_seconds=2950,
                episode_number=104,
                publish_date=now - timedelta(days=9),
                created_at=now - timedelta(days=9),
                updated_at=now - timedelta(days=9),
            ),
        ]
        for ep in episodes_comedy:
            db.add(ep)

        # 4. Education Essentials
        edu_podcast = Podcast(
            id=str(uuid.uuid4()),
            title="Education Essentials",
            description="Deep dives into pedagogy, lifelong learning sciences, cognitive psychology, and educational tech.",
            author="Prof. Sarah Lin",
            cover_image_url="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60",
            category="Education",
            total_subscribers=9800,
            created_at=now - timedelta(days=45),
            updated_at=now - timedelta(days=45),
        )
        db.add(edu_podcast)
        db.flush()

        episodes_edu = [
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=edu_podcast.id,
                title="Episode 18: Cognitive Load Theory in Practice",
                description="Practical strategies for structuring educational content to maximize student retention and focus.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
                duration_seconds=1980,
                episode_number=18,
                publish_date=now - timedelta(days=5),
                created_at=now - timedelta(days=5),
                updated_at=now - timedelta(days=5),
            ),
        ]
        for ep in episodes_edu:
            db.add(ep)

        # 5. Science Horizons
        sci_podcast = Podcast(
            id=str(uuid.uuid4()),
            title="Science Horizons",
            description="Exploring astrophysics, quantum computing, biotechnology breakthroughs, and the frontiers of discovery.",
            author="Dr. Marcus Vance",
            cover_image_url="https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=60",
            category="Science",
            total_subscribers=15300,
            created_at=now - timedelta(days=80),
            updated_at=now - timedelta(days=80),
        )
        db.add(sci_podcast)
        db.flush()

        episodes_sci = [
            Episode(
                id=str(uuid.uuid4()),
                podcast_id=sci_podcast.id,
                title="Episode 55: The Quantum Advantage",
                description="An accessible journey into quantum superposition, error correction, and near-term commercial qubits.",
                audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
                duration_seconds=2600,
                episode_number=55,
                publish_date=now - timedelta(days=4),
                created_at=now - timedelta(days=4),
                updated_at=now - timedelta(days=4),
            ),
        ]
        for ep in episodes_sci:
            db.add(ep)

        db.commit()
        logger.info(
            "Successfully seeded database with initial podcast and episode catalog."
        )
    except Exception as e:
        db.rollback()
        logger.error("Error seeding initial data: %s", e)
        raise


def init_db() -> None:
    """Create all database tables and seed sample data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
