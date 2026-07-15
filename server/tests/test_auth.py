from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.database import Base, get_db
from server.main import app

# Use a unique SQLite database for this test file to avoid state leakage
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_auth_unique.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Drop and recreate tables to ensure a clean slate
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_register_and_login():
    # Register
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "testbroker",
            "email": "test@example.com",
            "password": "testpassword",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testbroker"
    assert data["email"] == "test@example.com"
    assert "id" in data

    # Duplicate Register
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "testbroker",
            "email": "test@example.com",
            "password": "testpassword",
        },
    )
    assert response.status_code == 400

    # Login
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "testbroker", "password": "testpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Invalid Login
    response = client.post(
        "/api/v1/auth/token",
        data={"username": "testbroker", "password": "wrongpassword"},
    )
    assert response.status_code == 401
