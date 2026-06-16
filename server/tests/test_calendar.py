"""
Module: server.tests.test_calendar
Purpose: Unit tests for the calendar grid generation API.
Author: Backend Developer Agent
Created: 2026-06-16
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import Base, get_db

# Use in-memory SQLite with StaticPool for clean, isolated tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_get_calendar_grid_success():
    # Test July 2024 (starts on Monday, July 1st, so Sunday June 30th is padding)
    response = client.get("/api/v1/calendar/2024/7")
    assert response.status_code == 200
    data = response.json()
    assert data["year"] == 2024
    assert data["month"] == 7
    assert "days" in data
    
    days = data["days"]
    # July 2024 starts on Monday, so Sunday June 30th is padding (1 day)
    # July has 31 days.
    # Total days in grid = 1 (padding) + 31 (current) + 3 (next month padding) = 35 days
    assert len(days) == 35
    
    # First day should be June 30th
    assert days[0]["date"] == "2024-06-30"
    assert days[0]["day_number"] == 30
    assert days[0]["is_current_month"] is False
    
    # Second day should be July 1st
    assert days[1]["date"] == "2024-07-01"
    assert days[1]["day_number"] == 1
    assert days[1]["is_current_month"] is True

def test_get_calendar_grid_invalid_month():
    response = client.get("/api/v1/calendar/2024/13")
    assert response.status_code == 400
    assert "Invalid month" in response.json()["detail"]

def test_get_calendar_grid_invalid_year():
    response = client.get("/api/v1/calendar/0/7")
    assert response.status_code == 400
    assert "Invalid year" in response.json()["detail"]
