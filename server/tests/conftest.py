import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from server.main import app
from server.database import Base, get_db
from server import models

# Use SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)


@pytest.fixture(scope="session")
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    # Seed test data
    from server.auth import get_password_hash

    test_user = models.User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        login_id="testuser",
        mobile_number="1234567890",
        security_question="What is your favorite color?",
        security_answer_hash=get_password_hash("blue"),
    )
    session.add(test_user)
    session.commit()
    session.refresh(test_user)

    # Seed some worklist items
    items = [
        models.WorklistItem(
            name="Implement OAuth2 Authentication", status="To Do", user_id=test_user.id
        ),
        models.WorklistItem(
            name="Design Database Schema", status="In Progress", user_id=test_user.id
        ),
        models.WorklistItem(
            name="Setup CI/CD Pipeline", status="Done", user_id=test_user.id
        ),
    ]
    session.add_all(items)
    session.commit()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="session")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
