from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid

# Use a separate in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
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

def test_create_meal_plan():
    user_id = str(uuid.uuid4())
    response = client.post(
        "/api/v1/mealplans",
        json={
            "user_id": user_id,
            "cooking_time": 30,
            "dietary_goals": ["low-carb", "high-protein"],
            "preferences": ["no seafood"]
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == user_id
    assert "id" in data
    assert "meals" in data
    assert len(data["meals"]) == 7

def test_read_meal_plans():
    user_id = str(uuid.uuid4())
    # First create a meal plan to ensure there is data to retrieve
    client.post(
        "/api/v1/mealplans",
        json={
            "user_id": user_id,
            "cooking_time": 30,
            "dietary_goals": ["low-carb", "high-protein"],
            "preferences": ["no seafood"]
        },
    )
    
    response = client.get(f"/api/v1/mealplans/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["user_id"] == user_id
