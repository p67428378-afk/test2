import uuid
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from server.app.config import settings


def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    try:
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except Exception:
        return False


# SQLAlchemy setup
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {},
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
    # Import models to register them on Base.metadata
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    from server.app.models.user import User
    from server.app.models.film import Film
    from sqlalchemy.exc import IntegrityError

    # Seed regular user
    regular_email = "test@example.com"
    regular_user = db.query(User).filter(User.email == regular_email).first()
    if not regular_user:
        hashed_pwd = get_password_hash("testpassword")
        regular_user = User(
            id=str(uuid.uuid4()), email=regular_email, hashed_password=hashed_pwd
        )
        db.add(regular_user)
        try:
            db.commit()
            db.refresh(regular_user)
        except IntegrityError:
            db.rollback()
            regular_user = db.query(User).filter(User.email == regular_email).first()

    # Seed some initial films for search
    initial_films = [
        {
            "title": "Inception",
            "release_year": 2010,
            "genre": "Sci-Fi/Action",
            "poster_url": "https://example.com/inception.jpg",
        },
        {
            "title": "The Matrix",
            "release_year": 1999,
            "genre": "Sci-Fi/Action",
            "poster_url": "https://example.com/matrix.jpg",
        },
        {
            "title": "Interstellar",
            "release_year": 2014,
            "genre": "Sci-Fi/Drama",
            "poster_url": "https://example.com/interstellar.jpg",
        },
        {
            "title": "The Dark Knight",
            "release_year": 2008,
            "genre": "Action/Drama",
            "poster_url": "https://example.com/dark_knight.jpg",
        },
    ]

    for film_data in initial_films:
        existing_film = db.query(Film).filter(Film.title == film_data["title"]).first()
        if not existing_film:
            film = Film(
                id=str(uuid.uuid4()),
                title=film_data["title"],
                release_year=film_data["release_year"],
                genre=film_data["genre"],
                poster_url=film_data["poster_url"],
            )
            db.add(film)
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
