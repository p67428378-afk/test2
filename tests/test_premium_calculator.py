from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app import models, schemas
from decimal import Decimal
import pytest

def test_calculate_premium_success(client: TestClient, session: Session):
    # Create a customer and vehicle first
    customer_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone_number": "1234567890",
        "address": "123 Main St"
    }
    customer = models.Customer(**customer_data)
    session.add(customer)
    session.commit()
    session.refresh(customer)

    vehicle_data = {
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "vin": "VIN12345"
    }
    vehicle = models.Vehicle(**vehicle_data)
    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)

    request_payload = {
        "base_rate": 500.00,
        "ncb_percentage": 0.20,
        "vehicle_multiplier": 0.8,
        "vehicle_details": {
            "make": "Toyota",
            "model": "Camry",
            "year": 2020,
            "vin": "VIN12345"
        },
        "customer_details": {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone_number": "1234567890",
            "address": "123 Main St"
        }
    }

    response = client.post("/calculate-premium", json=request_payload)
    assert response.status_code == 200
    response_data = response.json()
    assert "calculated_premium" in response_data
    assert Decimal(str(response_data["calculated_premium"])) == Decimal("320.00")
    assert response_data["currency"] == "USD"
    assert "policy_id" in response_data

    # Verify data persistence
    policy = session.query(models.Policy).filter(models.Policy.policy_id == response_data["policy_id"]).first()
    assert policy is not None
    assert policy.calculated_premium == Decimal("320.00")
    assert policy.customer.email == "john.doe@example.com"
    assert policy.vehicle.vin == "VIN12345"

def test_calculate_premium_ncb_cap(client: TestClient, session: Session):
    # Create a customer and vehicle first
    customer_data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@example.com",
        "phone_number": "0987654321",
        "address": "456 Oak Ave"
    }
    customer = models.Customer(**customer_data)
    session.add(customer)
    session.commit()
    session.refresh(customer)

    vehicle_data = {
        "make": "Honda",
        "model": "Civic",
        "year": 2018,
        "vin": "VIN67890"
    }
    vehicle = models.Vehicle(**vehicle_data)
    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)

    request_payload = {
        "base_rate": 500.00,
        "ncb_percentage": 0.60, # Should be capped at 0.50
        "vehicle_multiplier": 0.8,
        "vehicle_details": {
            "make": "Honda",
            "model": "Civic",
            "year": 2018,
            "vin": "VIN67890"
        },
        "customer_details": {
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@example.com",
            "phone_number": "0987654321",
            "address": "456 Oak Ave"
        }
    }

    response = client.post("/calculate-premium", json=request_payload)
    assert response.status_code == 422 # Pydantic validation should catch this

def test_calculate_premium_invalid_multiplier(client: TestClient, session: Session):
    # Create a customer and vehicle first
    customer_data = {
        "first_name": "Peter",
        "last_name": "Pan",
        "email": "peter.pan@example.com",
        "phone_number": "1112223333",
        "address": "Neverland"
    }
    customer = models.Customer(**customer_data)
    session.add(customer)
    session.commit()
    session.refresh(customer)

    vehicle_data = {
        "make": "Ford",
        "model": "Focus",
        "year": 2015,
        "vin": "VIN11223"
    }
    vehicle = models.Vehicle(**vehicle_data)
    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)

    request_payload = {
        "base_rate": 500.00,
        "ncb_percentage": 0.20,
        "vehicle_multiplier": 1.8, # Should be invalid
        "vehicle_details": {
            "make": "Ford",
            "model": "Focus",
            "year": 2015,
            "vin": "VIN11223"
        },
        "customer_details": {
            "first_name": "Peter",
            "last_name": "Pan",
            "email": "peter.pan@example.com",
            "phone_number": "1112223333",
            "address": "Neverland"
        }
    }

    response = client.post("/calculate-premium", json=request_payload)
    assert response.status_code == 422 # Pydantic validation should catch this

def test_calculate_premium_missing_fields(client: TestClient):
    request_payload = {
        "base_rate": 500.00,
        "ncb_percentage": 0.20,
        # "vehicle_multiplier": 0.8, # Missing
        "vehicle_details": {
            "make": "BMW",
            "model": "X5",
            "year": 2022
        },
        "customer_details": {
            "first_name": "Alice",
            "last_name": "Smith",
            "email": "alice.smith@example.com",
            "phone_number": "4445556666",
            "address": "789 Pine St"
        }
    }
    response = client.post("/calculate-premium", json=request_payload)
    assert response.status_code == 422

def test_calculate_premium_existing_customer_vehicle(client: TestClient, session: Session):
    # Pre-create customer and vehicle
    existing_customer = models.Customer(
        first_name="Existing", last_name="Customer", email="existing@example.com",
        phone_number="9998887777", address="Existing Address"
    )
    existing_vehicle = models.Vehicle(
        make="Audi", model="A4", year=2021, vin="EXISTINGVIN"
    )
    session.add_all([existing_customer, existing_vehicle])
    session.commit()
    session.refresh(existing_customer)
    session.refresh(existing_vehicle)

    request_payload = {
        "base_rate": 500.00,
        "ncb_percentage": 0.10,
        "vehicle_multiplier": 1.0,
        "vehicle_details": {
            "make": "Audi",
            "model": "A4",
            "year": 2021,
            "vin": "EXISTINGVIN"
        },
        "customer_details": {
            "first_name": "Existing",
            "last_name": "Customer",
            "email": "existing@example.com",
            "phone_number": "9998887777",
            "address": "Existing Address"
        }
    }

    response = client.post("/calculate-premium", json=request_payload)
    assert response.status_code == 200
    response_data = response.json()
    assert Decimal(str(response_data["calculated_premium"])) == Decimal("450.00")

    # Verify that no new customer/vehicle was created, but policy was linked
    customers_count = session.query(models.Customer).count()
    vehicles_count = session.query(models.Vehicle).count()
    policies_count = session.query(models.Policy).count()

    assert customers_count == 1
    assert vehicles_count == 1
    assert policies_count == 1

    policy = session.query(models.Policy).filter(models.Policy.policy_id == response_data["policy_id"]).first()
    assert policy.customer_id == existing_customer.customer_id
    assert policy.vehicle_id == existing_vehicle.vehicle_id
