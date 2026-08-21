from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from server.config import settings

# For SQLite, we need connect_args={"check_same_thread": False}
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
    # Import models here to ensure they are registered on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db):
    from server.models import User, LearningItem
    import bcrypt
    from sqlalchemy.exc import IntegrityError

    # 1. Seed Parent Users
    # We seed parent_admin, test@example.com, and admin@example.com
    users_to_seed = [
        {"username": "parent_admin", "password": "secure_password", "role": "parent"},
        {"username": "test@example.com", "password": "testpassword", "role": "parent"},
        {
            "username": "admin@example.com",
            "password": "adminpassword",
            "role": "parent",
        },
    ]

    for u_data in users_to_seed:
        existing_user = (
            db.query(User).filter(User.username == u_data["username"]).first()
        )
        if not existing_user:
            # Hash password using bcrypt directly
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(
                u_data["password"].encode("utf-8"), salt
            ).decode("utf-8")
            new_user = User(
                username=u_data["username"],
                password_hash=hashed_password,
                role=u_data["role"],
            )
            db.add(new_user)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()

    # 2. Seed Learning Items (A-Z and 1-10)
    # Alphabet items (A-Z)
    alphabet_data = [
        ("A", "Apple", "🍎"),
        ("B", "Balloon", "🎈"),
        ("C", "Cat", "🐱"),
        ("D", "Dog", "🐶"),
        ("E", "Elephant", "🐘"),
        ("F", "Frog", "🐸"),
        ("G", "Grapes", "🍇"),
        ("H", "Hat", "🎩"),
        ("I", "Igloo", "⛺"),
        ("J", "Juice", "🧃"),
        ("K", "Kite", "🪁"),
        ("L", "Lion", "🦁"),
        ("M", "Monkey", "🐒"),
        ("N", "Nest", "🪹"),
        ("O", "Owl", "🦉"),
        ("P", "Penguin", "🐧"),
        ("Q", "Queen", "👑"),
        ("R", "Rabbit", "🐇"),
        ("S", "Sun", "☀️"),
        ("T", "Tiger", "🐅"),
        ("U", "Umbrella", "☂️"),
        ("V", "Violin", "🎻"),
        ("W", "Watermelon", "🍉"),
        ("X", "Xylophone", "🪘"),
        ("Y", "Yak", "🐂"),
        ("Z", "Zebra", "🦓"),
    ]

    for val, word, emoji in alphabet_data:
        existing_item = (
            db.query(LearningItem)
            .filter(LearningItem.type == "alphabet", LearningItem.value == val)
            .first()
        )
        if not existing_item:
            new_item = LearningItem(
                type="alphabet",
                value=val,
                word_association=word,
                image_url=f"https://storage.googleapis.com/kids-learning-assets/images/{val.lower()}.png",
                audio_url=f"https://storage.googleapis.com/kids-learning-assets/audio/{val.lower()}_is_for_{word.lower()}.mp3",
            )
            db.add(new_item)

    # Number items (1-10)
    number_words = {
        "1": "One",
        "2": "Two",
        "3": "Three",
        "4": "Four",
        "5": "Five",
        "6": "Six",
        "7": "Seven",
        "8": "Eight",
        "9": "Nine",
        "10": "Ten",
    }
    for i in range(1, 11):
        val = str(i)
        word = number_words[val]
        existing_item = (
            db.query(LearningItem)
            .filter(LearningItem.type == "number", LearningItem.value == val)
            .first()
        )
        if not existing_item:
            new_item = LearningItem(
                type="number",
                value=val,
                word_association=word,
                image_url=f"https://storage.googleapis.com/kids-learning-assets/images/{val}.png",
                audio_url=f"https://storage.googleapis.com/kids-learning-assets/audio/{val}.mp3",
            )
            db.add(new_item)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
