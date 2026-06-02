
from fastapi.testclient import TestClient
from server.main import app
from server.database import SessionLocal, engine
from server import models
import uuid
from datetime import date

client = TestClient(app)

def setup_module(module):
    models.Base.metadata.create_all(bind=engine)

def teardown_module(module):
    models.Base.metadata.drop_all(bind=engine)

def test_read_pandit_availability():
    db = SessionLocal()
    pandit_id = uuid.uuid4()
    db.add(models.Pandit(id=pandit_id, name="Test Pandit"))
    db.add(models.PanditAvailability(pandit_id=pandit_id, date=date(2023, 10, 1), is_blocked=True))
    db.commit()

    response = client.get(f"/api/v1/pandits/{pandit_id}/availability?month=10&year=2023")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["is_blocked"] == True
    db.close()

def test_update_pandit_availability():
    db = SessionLocal()
    pandit_id = uuid.uuid4()
    db.add(models.Pandit(id=pandit_id, name="Test Pandit 2"))
    db.commit()

    response = client.post(
        f"/api/v1/pandits/{pandit_id}/availability",
        json={"dates": ["2023-10-05"], "is_blocked": True},
    )
    assert response.status_code == 200
    assert response.json() == {"status": "success"}

    availability = db.query(models.PanditAvailability).filter_by(pandit_id=pandit_id).first()
    assert availability.is_blocked == True
    db.close()

def test_read_pandit_shifts():
    db = SessionLocal()
    pandit_id = uuid.uuid4()
    db.add(models.Pandit(id=pandit_id, name="Test Pandit 3"))
    db.add(models.PanditShift(pandit_id=pandit_id, date=date(2023, 10, 10), shift="morning", location="Main Temple"))
    db.commit()

    response = client.get(f"/api/v1/pandits/{pandit_id}/shifts")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["shift"] == "morning"
    db.close()
