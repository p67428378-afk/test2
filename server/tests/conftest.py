
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
import uuid
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


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Add a snack
    snack = models.Snack(name="test snack", id=uuid.uuid4())
    db.add(snack)
    db.commit()
    # Add an inventory item
    inventory_item = models.InventoryItem(
        snack_id=snack.id,
        quantity=10,
        location="test location",
        id = uuid.uuid4()
    )
    db.add(inventory_item)
    db.commit()

    yield db, inventory_item.id

    Base.metadata.drop_all(bind=engine)
