import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.database import Base, get_db
from server.main import app

# Setup test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    # Create all tables on the test engine
    Base.metadata.create_all(bind=engine)

    # Seed the default test user so that the database has the 'users' table and the user exists
    db = TestingSessionLocal()
    from uuid import uuid4
    from server.models import User

    user = db.query(User).filter(User.login_id == "test@example.com").first()
    if not user:
        user = User(
            id=uuid4(),
            login_id="test@example.com",
            mobile_number="1234567890",
            hashed_password="dummy_hashed_password",
            security_question="What is your favorite color?",
            security_answer_hash="dummy_answer_hash",
        )
        db.add(user)
        db.commit()
    db.close()
    yield
