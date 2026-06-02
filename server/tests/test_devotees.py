
from fastapi.testclient import TestClient
from server.main import app
from server.database import SessionLocal, engine
from server import models
import uuid

client = TestClient(app)

def setup_module(module):
    models.Base.metadata.create_all(bind=engine)

def teardown_module(module):
    models.Base.metadata.drop_all(bind=engine)

def test_read_devotee_sankalpa_details():
    db = SessionLocal()
    devotee_id = uuid.uuid4()
    db.add(models.Devotee(id=devotee_id, name="Ramesh Iyer", gothra="Kashyapa", family_members="Wife (Sita), Son (Rahul), Daughter (Priya)"))
    db.commit()

    response = client.get(f"/api/v1/devotees/{devotee_id}/sankalpa-details")
    assert response.status_code == 200
    assert response.json()["name"] == "Ramesh Iyer"
    assert response.json()["gothra"] == "Kashyapa"
    assert response.json()["family_members"] == "Wife (Sita), Son (Rahul), Daughter (Priya)"
    db.close()

def test_read_devotee_sankalpa_details_not_found():
    response = client.get(f"/api/v1/devotees/{uuid.uuid4()}/sankalpa-details")
    assert response.status_code == 404
    assert response.json() == {"detail": "Devotee not found"}
