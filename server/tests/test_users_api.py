from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app, get_db
from server.database import Base
from server.models.user import User
from passlib.context import CryptContext

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

enfine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=enfine)

Base.metadata.create_all(bind=enfine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_test_user():
    db = TestingSessionLocal()
    db.query(User).delete()
    db.commit()
    user = User(username="testuser", hashed_password=get_password_hash("testpassword"), role="Forecaster", station="Test Station")
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user

def get_auth_token():
    create_test_user()
    response = client.post("/api/v1/token", data={"username": "testuser", "password": "testpassword"})
    return response.json()["access_token"]

def test_read_users_me():
    token = get_auth_token()
    response = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert "id" in data
