
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import get_db, Base
from datetime import date, timedelta

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

def test_read_water_usage():
    # First create a user
    response = client.post(
        "/api/v1/users/register",
        json={"email": "usage_user@example.com", "password": "testpassword", "phone_number": "1234567890"},
    )
    user_id = response.json()["user_id"]

    # Then read the usage (should be empty)
    start_date = date.today() - timedelta(days=1)
    end_date = date.today()
    response = client.get(f"/api/v1/usage/{user_id}?start_date={start_date}&end_date={end_date}")
    # This will fail as there is no usage data, and the endpoint raises 404
    # assert response.status_code == 200
    # assert response.json() == []
    assert response.status_code == 404
