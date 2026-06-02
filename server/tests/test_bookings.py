
from fastapi.testclient import TestClient
from server.main import app
from server.database import SessionLocal, engine
from server import models
import uuid
from datetime import datetime, date

client = TestClient(app)

def setup_module(module):
    models.Base.metadata.create_all(bind=engine)

def teardown_module(module):
    models.Base.metadata.drop_all(bind=engine)

def test_read_daily_agenda():
    db = SessionLocal()
    pandit_id = uuid.uuid4()
    devotee_id = uuid.uuid4()
    db.add(models.Pandit(id=pandit_id, name="Test Pandit"))
    db.add(models.Devotee(id=devotee_id, name="Test Devotee"))
    db.add(models.Booking(pandit_id=pandit_id, devotee_id=devotee_id, puja_type="Ganesha Homam", booking_time=datetime(2023, 10, 9, 10, 30)))
    db.commit()

    response = client.get(f"/api/v1/bookings/daily-agenda?pandit_id={pandit_id}&date=2023-10-09")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["puja_type"] == "Ganesha Homam"
    db.close()
