import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, engine
from server.models import Recipe, Ingredient, Instruction

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Clear any dependency overrides from other tests
    app.dependency_overrides.clear()
    # Re-create tables for testing
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    # Re-run seeding
    from server.main import seed_db
    try:
        seed_db()
    except Exception as e:
        print(f"SEEDING ERROR: {e}")
        raise e

def test_read_recipes():
    response = client.get("/api/recipes")
    print("RECIPES RESPONSE:", response.status_code, response.text)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3

def test_read_recipe_detail():
    response = client.get("/api/recipes/11111111-1111-1111-1111-111111111111")
    print("RECIPE DETAIL RESPONSE:", response.status_code, response.text)
    assert response.status_code == 200

def test_read_recipe_not_found():
    response = client.get("/api/recipes/99999999-9999-9999-9999-999999999999")
    print("RECIPE NOT FOUND RESPONSE:", response.status_code, response.text)
    assert response.status_code == 404
