import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import models
from decimal import Decimal
import uuid

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
def setup_db():
    # Clear tables and seed fresh data for tests
    db = TestingSessionLocal()
    db.query(models.PencilCategory).delete()
    db.query(models.Pencil).delete()
    db.query(models.Category).delete()
    db.commit()

    # Seed categories
    cat_graphite = models.Category(
        name="Graphite Pencils",
        description="Standard writing and drawing pencils.",
        image_url="http://example.com/graphite.jpg",
    )
    cat_charcoal = models.Category(
        name="Charcoal Pencils",
        description="Rich, dark pencils.",
        image_url="http://example.com/charcoal.jpg",
    )
    db.add_all([cat_graphite, cat_charcoal])
    db.commit()
    db.refresh(cat_graphite)
    db.refresh(cat_charcoal)

    # Seed pencils
    pencil1 = models.Pencil(
        name="Classic HB Graphite Pencil",
        description="The quintessential writing pencil.",
        price=Decimal("1.50"),
        hardness="HB",
        material="Cedar Wood & Graphite",
        core_diameter="2.0mm",
        length="175mm",
        shape="Hexagonal",
        eraser=True,
        image_url="http://example.com/hb.jpg",
        images=["http://example.com/hb1.jpg", "http://example.com/hb2.jpg"],
    )
    pencil1.categories.append(cat_graphite)

    pencil2 = models.Pencil(
        name="Soft Charcoal Sketching Pencil",
        description="Delivers deep, matte black tones.",
        price=Decimal("2.50"),
        hardness="Soft",
        material="Wood & Compressed Charcoal",
        core_diameter="4.0mm",
        length="175mm",
        shape="Round",
        eraser=False,
        image_url="http://example.com/charcoal_pencil.jpg",
        images=["http://example.com/charcoal_pencil.jpg"],
    )
    pencil2.categories.append(cat_charcoal)

    db.add_all([pencil1, pencil2])
    db.commit()
    db.close()


def test_get_categories():
    response = client.get("/api/v1/pencils/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    names = [cat["name"] for cat in data]
    assert "Graphite Pencils" in names
    assert "Charcoal Pencils" in names


def test_get_pencils_all():
    response = client.get("/api/v1/pencils")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert data["skip"] == 0
    assert data["limit"] == 10


def test_get_pencils_filter_by_category_name():
    response = client.get("/api/v1/pencils?category=Graphite")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Classic HB Graphite Pencil"


def test_get_pencils_filter_by_category_uuid():
    # Get category ID first
    cat_response = client.get("/api/v1/pencils/categories")
    cat_id = cat_response.json()[1]["id"]  # Charcoal Pencils

    response = client.get(f"/api/v1/pencils?category={cat_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Soft Charcoal Sketching Pencil"


def test_get_pencils_filter_by_hardness():
    response = client.get("/api/v1/pencils?hardness=Soft")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Soft Charcoal Sketching Pencil"


def test_get_pencils_filter_by_material():
    response = client.get("/api/v1/pencils?material=Cedar")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Classic HB Graphite Pencil"


def test_get_pencils_pagination():
    response = client.get("/api/v1/pencils?skip=1&limit=1")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 1
    assert data["skip"] == 1
    assert data["limit"] == 1


def test_get_pencil_by_id():
    # Get all pencils to find a valid ID
    pencils_response = client.get("/api/v1/pencils")
    pencil_id = pencils_response.json()["items"][0]["id"]

    response = client.get(f"/api/v1/pencils/{pencil_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == pencil_id
    assert "core_diameter" in data
    assert "eraser" in data
    assert "images" in data
    assert isinstance(data["images"], list)


def test_get_pencil_by_id_not_found():
    random_uuid = str(uuid.uuid4())
    response = client.get(f"/api/v1/pencils/{random_uuid}")
    assert response.status_code == 404
    assert response.json()["detail"] == "Pencil not found"
