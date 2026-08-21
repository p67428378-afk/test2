from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from server.config import settings

# For SQLite, we need check_same_thread=False
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    # Idempotent seeding of a sample deck and card
    from server.models import Deck, Card
    import uuid

    # Check if any decks exist
    if db.query(Deck).count() == 0:
        deck_id = str(uuid.uuid4())
        sample_deck = Deck(
            id=deck_id, title="JavaScript Basics", description="Core concepts of JS"
        )
        db.add(sample_deck)
        db.flush()

        sample_card = Card(
            id=str(uuid.uuid4()),
            deck_id=deck_id,
            front="What is a closure?",
            back="A closure is the combination of a function bundled together with references to its surrounding state.",
        )
        db.add(sample_card)
        try:
            db.commit()
        except Exception:
            db.rollback()
