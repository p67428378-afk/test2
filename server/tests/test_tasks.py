import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import date
from server.main import app
from server.database import Base, get_db
from server.models import User

DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_user():
    db = TestingSessionLocal()
    # Check if user already exists
    user = db.query(User).filter(User.login_id == "farmer_john").first()
    if not user:
        user = User(
            id="farmer-john-uuid",
            login_id="farmer_john",
            mobile_number="1234567890",
            hashed_password="hashed",
            security_question="What is your favorite flower?",
            security_answer_hash="hashed_answer"
        )
        db.add(user)
        db.commit()
    db.close()

def test_task_operations():
    # Create task
    scheduled_date = date.today().isoformat()
    response = client.post(
        "/api/v1/tasks",
        json={
            "user_id": "farmer-john-uuid",
            "task_type": "Planting",
            "description": "Plant Rose seeds",
            "scheduled_date": scheduled_date,
            "status": "Pending",
            "time_spent": 0
        }
    )
    assert response.status_code == 201
    task_id = response.json()["task_id"]
    assert response.json()["task_type"] == "Planting"

    # Create task with invalid user_id (should fail)
    response = client.post(
        "/api/v1/tasks",
        json={
            "user_id": "invalid-user-uuid",
            "task_type": "Planting",
            "description": "Plant Rose seeds",
            "scheduled_date": scheduled_date,
            "status": "Pending",
            "time_spent": 0
        }
    )
    assert response.status_code == 400

    # List tasks
    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) >= 1
    assert tasks[0]["task_type"] == "Planting"

    # Update task
    response = client.put(
        f"/api/v1/tasks/{task_id}",
        json={
            "status": "Completed",
            "time_spent": 120
        }
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Completed"
    assert response.json()["time_spent"] == 120

    # Update non-existent task (should fail)
    response = client.put(
        "/api/v1/tasks/non-existent-id",
        json={
            "status": "Completed",
            "time_spent": 120
        }
    )
    assert response.status_code == 404
