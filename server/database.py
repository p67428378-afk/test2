from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from server.core.config import settings
import traceback

engine = create_engine(settings.DATABASE_URL)
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


def seed_data(db=None):
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        from server import models

        # Check if enclosures already exist
        if db.query(models.Enclosure).first() is not None:
            return

        # Seed Enclosures
        lion_enclosure = models.Enclosure(
            id="11111111-1111-1111-1111-111111111111",
            name="Lion Enclosure",
            location_x=10.5,
            location_y=20.5,
            description="Home of the African Lions",
        )
        elephant_enclosure = models.Enclosure(
            id="22222222-2222-2222-2222-222222222222",
            name="Elephant Enclosure",
            location_x=30.0,
            location_y=40.0,
            description="Spacious habitat for Asian Elephants",
        )
        db.add(lion_enclosure)
        db.add(elephant_enclosure)
        db.commit()

        # Seed Animals
        simba = models.Animal(
            id="33333333-3333-3333-3333-333333333333",
            name="Simba",
            species="Lion",
            status="Active",
            enclosure_id=lion_enclosure.id,
            habitat="Savannah",
            diet="Carnivore",
            conservation_status="Vulnerable",
            image_url="https://example.com/simba.jpg",
            qr_code="LION_01",
        )
        dumbo = models.Animal(
            id="44444444-4444-4444-4444-444444444444",
            name="Dumbo",
            species="Elephant",
            status="Active",
            enclosure_id=elephant_enclosure.id,
            habitat="Forest",
            diet="Herbivore",
            conservation_status="Endangered",
            image_url="https://example.com/dumbo.jpg",
            qr_code="ELEPHANT_01",
        )
        db.add(simba)
        db.add(dumbo)

        # Seed Facilities
        restroom = models.Facility(
            id="55555555-5555-5555-5555-555555555555",
            name="Main Restroom",
            type="Restroom",
            location_x=5.0,
            location_y=5.0,
        )
        cafe = models.Facility(
            id="66666666-6666-6666-6666-666666666666",
            name="Zoo Cafe",
            type="Food",
            location_x=15.0,
            location_y=15.0,
        )
        db.add(restroom)
        db.add(cafe)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
        traceback.print_exc()
    finally:
        if should_close:
            db.close()
