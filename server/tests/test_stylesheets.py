import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

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


@pytest.fixture(autouse=True)
def clean_db():
    db = TestingSessionLocal()
    db.query(models.Stylesheet).delete()
    db.commit()
    db.close()


def test_get_stylesheets_empty_seeds_default():
    response = client.get("/api/v1/stylesheets")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Standard Academic Style"
    assert "max_title_length" in data[0]["rules"]


def test_create_stylesheet():
    rules = {"max_title_length": 80, "min_abstract_length": 100}
    response = client.post("/api/v1/stylesheets?name=Nature%20Style", json=rules)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Nature Style"
    assert data["rules"] == rules

    # Now list should return both
    list_resp = client.get("/api/v1/stylesheets")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 2
