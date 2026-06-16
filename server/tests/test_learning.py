import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_get_alphabets():
    response = client.get("/api/v1/alphabets")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 26
    assert data[0]["letter"] == "A"
    assert data[0]["word"] == "Apple"
    assert data[0]["emoji"] == "🍎"
    assert "id" in data[0]
    assert "created_at" in data[0]
    assert "updated_at" in data[0]

def test_get_numbers():
    response = client.get("/api/v1/numbers")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 20
    assert data[0]["number"] == 1
    assert data[0]["word"] == "One"
    assert data[0]["emoji"] == "🎈"
    assert "id" in data[0]
    assert "created_at" in data[0]
    assert "updated_at" in data[0]
