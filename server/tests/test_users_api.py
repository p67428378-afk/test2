from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import get_db, Base
from server.models.user import User
from server.services.auth import create_access_token
from datetime import timedelta
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()
        db.close()


def override_get_db(db_session):
    def _override_get_db():
        try:
            yield db_session
        finally:
            pass
    return _override_get_db


client = TestClient(app)

def get_auth_token(db_session, username="testuser"):
    token_data = {"sub": username}
    access_token = create_access_token(data=token_data, expires_delta=timedelta(minutes=30))
    return access_token

def test_create_user(db_session):
    app.dependency_overrides[get_db] = override_get_db(db_session)
    response = client.post(
        "/api/v1/users/",
        json={"username": "testuser", "password": "testpassword", "full_name": "Test User", "role": "Forecaster"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "id" in data

def test_read_user_me(db_session):
    app.dependency_overrides[get_db] = override_get_db(db_session)
    # Create user first
    user_data = {"username": "testuser_me", "password": "testpassword", "full_name": "Test User Me", "role": "Forecaster"}
    client.post("/api/v1/users/", json=user_data)
    
    token = get_auth_token(db_session, username="testuser_me")
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser_me"
