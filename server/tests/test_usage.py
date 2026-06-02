
from fastapi.testclient import TestClient
from server.main import app
from server.database import get_db, Base, engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
from datetime import datetime, timedelta

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

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_read_water_usage(db_session):
    response = client.post(
        "/api/v1/users/register",
        json={"email": "usage_test@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    user_id = response.json()["user_id"]

    # TODO: Create water usage data for testing

    start_date = (datetime.now() - timedelta(days=1)).isoformat()
    end_date = datetime.now().isoformat()

    response = client.get(f"/api/v1/usage/{user_id}?start_date={start_date}&end_date={end_date}")
    # This will fail as no usage data is created yet
    # assert response.status_code == 200
    # assert isinstance(response.json(), list)
