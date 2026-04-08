from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from backend.app.models.models import CreditCardProduct
from backend.app.schemas.schemas import CreditCardProductCreate

def test_create_credit_card_product(client: TestClient, db_session: Session):
    product_data = {
        "name": "Test Card",
        "description": "A test credit card.",
        "features": "Feature 1, Feature 2",
        "eligibility_criteria": "Criteria 1, Criteria 2"
    }
    response = client.post("/credit_card_products/", json=product_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == product_data["name"]
    assert "id" in data

    # Verify it's in the database
    product = db_session.query(CreditCardProduct).filter(CreditCardProduct.name == product_data["name"]).first()
    assert product is not None
    assert product.description == product_data["description"]

def test_read_credit_card_products(client: TestClient, db_session: Session):
    # Create a product first
    product_data = {
        "name": "Another Test Card",
        "description": "Another test credit card.",
        "features": "Feature A, Feature B",
        "eligibility_criteria": "Criteria A, Criteria B"
    }
    client.post("/credit_card_products/", json=product_data)

    response = client.get("/credit_card_products/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert any(product["name"] == "Another Test Card" for product in data)

def test_read_single_credit_card_product(client: TestClient, db_session: Session):
    product_data = {
        "name": "Single Test Card",
        "description": "A single test credit card.",
        "features": "Single Feature",
        "eligibility_criteria": "Single Criteria"
    }
    post_response = client.post("/credit_card_products/", json=product_data)
    product_id = post_response.json()["id"]

    response = client.get(f"/credit_card_products/{product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == product_data["name"]
    assert data["id"] == product_id

def test_read_non_existent_credit_card_product(client: TestClient):
    response = client.get("/credit_card_products/non_existent_id")
    assert response.status_code == 404
