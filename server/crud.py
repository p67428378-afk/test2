import uuid
from sqlalchemy.orm import Session
from server import models

INITIAL_GREETINGS = [
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "greeting": "Namaste",
        "region": "Widespread",
        "description": "A respectful greeting, often accompanied by a slight bow and with hands pressed together at chest level.",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
        "greeting": "Vanakkam",
        "region": "Tamil Nadu",
        "description": "The traditional greeting in Tamil culture, expressing respect and honor to the guest.",
    },
    {
        "id": uuid.UUID("33333333-3333-3333-3333-333333333333"),
        "greeting": "Sat Sri Akaal",
        "region": "Punjab",
        "description": "A Sikh greeting meaning 'God is the Ultimate Truth,' spoken with hands folded in respect.",
    },
    {
        "id": uuid.UUID("44444444-4444-4444-4444-444444444444"),
        "greeting": "Aadab",
        "region": "Hyderabad / North",
        "description": "A polite hand gesture (raising the right hand toward the forehead) used as a respectful greeting.",
    },
    {
        "id": uuid.UUID("55555555-5555-5555-5555-555555555555"),
        "greeting": "Nomoskar",
        "region": "West Bengal",
        "description": "The traditional Bengali greeting, used to show respect and warmth to elders and peers alike.",
    },
]


def get_greetings(db: Session, skip: int = 0, limit: int = 20):
    return db.query(models.Greeting).offset(skip).limit(limit).all()


def seed_greetings(db: Session):
    # Check if greetings table is empty
    if db.query(models.Greeting).count() == 0:
        for g in INITIAL_GREETINGS:
            db_greeting = models.Greeting(
                id=g["id"],
                greeting=g["greeting"],
                region=g["region"],
                description=g["description"],
            )
            db.add(db_greeting)
        db.commit()
