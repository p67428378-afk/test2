"""
Module: test_items
Purpose: Unit and integration tests for items, auctions, and bidding endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime, timedelta, timezone
from server.main import app
from server.database import get_db
from server import models, schemas, crud
import os

# Use DATABASE_URL from env or fallback to in-memory SQLite
DB_URL = os.getenv("DATABASE_URL", "sqlite:///:memory:")
connect_args = {"check_same_thread": False} if "sqlite" in DB_URL else {}

engine = create_engine(
    DB_URL,
    connect_args=connect_args,
    poolclass=StaticPool if "sqlite" in DB_URL else None,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    models.Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()
    models.Base.metadata.drop_all(bind=engine)


client = TestClient(app)


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def test_user_and_token(db_session):
    # Create a seller/user with a unique mobile number to avoid conflict with seeded user
    user_req = schemas.UserRegisterRequest(
        login_id="seller@example.com",
        mobile_number="5555555555",
        password="password123",
        security_question="Q",
        security_answer="A",
    )
    user = crud.create_user(db_session, user_req)

    # Login to get token
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"login_id": "seller@example.com", "password": "password123"},
    )
    token = login_resp.json()["access_token"]
    return user, token


@pytest.fixture
def test_item_and_auction(db_session, test_user_and_token):
    user, _ = test_user_and_token

    # Create an item
    item = models.Item(
        name="Ancient Rare Vase",
        description="A beautiful ancient rare traditional vase from the Ming Dynasty.",
        images=["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        seller_id=user.id,
    )
    db_session.add(item)
    db_session.commit()
    db_session.refresh(item)

    # Create an active auction
    auction = models.Auction(
        item_id=item.id,
        start_time=datetime.now(timezone.utc) - timedelta(hours=1),
        end_time=datetime.now(timezone.utc) + timedelta(hours=2),
        starting_price=100.0,
        current_highest_bid=None,
        status="active",
    )
    db_session.add(auction)
    db_session.commit()
    db_session.refresh(item)
    db_session.refresh(auction)

    return item, auction


def test_get_items(test_item_and_auction):
    # AC: Users can view a list of all available items for auction.
    # AC: Each item in the list displays its name, a brief description, the current highest bid, and the time remaining in the auction.
    response = client.get("/api/v1/items")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    item = data["items"][0]
    assert item["name"] == "Ancient Rare Vase"
    assert (
        item["description"]
        == "A beautiful ancient rare traditional vase from the Ming Dynasty."
    )
    assert item["auction"]["starting_price"] == 100.0
    assert item["auction"]["current_highest_bid"] is None
    assert "end_time" in item["auction"]


def test_get_item_detail(test_item_and_auction):
    # AC: Users can click on an item to view its detailed page, which includes a longer description, multiple images, the full bidding history, and the seller's information.
    item, _ = test_item_and_auction
    response = client.get(f"/api/v1/items/{item.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Ancient Rare Vase"
    assert (
        data["description"]
        == "A beautiful ancient rare traditional vase from the Ming Dynasty."
    )
    assert len(data["images"]) == 2
    assert data["seller_name"] == "seller@example.com"
    assert data["auction"]["starting_price"] == 100.0
    assert len(data["auction"]["bids"]) == 0


def test_get_item_detail_not_found():
    # AC: Item not found returns 404
    response = client.get("/api/v1/items/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found"


def test_place_bid_success(test_item_and_auction, test_user_and_token):
    # AC: Users can place a bid on an item from the item's detail page.
    item, _ = test_item_and_auction
    _, token = test_user_and_token

    response = client.post(
        f"/api/v1/items/{item.id}/bid",
        json={"amount": 150.0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 150.0
    assert "id" in data

    # Verify item detail now shows the bid
    detail_resp = client.get(f"/api/v1/items/{item.id}")
    assert detail_resp.status_code == 200
    detail_data = detail_resp.json()
    assert detail_data["auction"]["current_highest_bid"] == 150.0
    assert len(detail_data["auction"]["bids"]) == 1
    assert detail_data["auction"]["bids"][0]["amount"] == 150.0
    assert detail_data["auction"]["bids"][0]["user_name"] == "seller@example.com"


def test_place_bid_unauthenticated(test_item_and_auction):
    # AC: Placing a bid requires authentication (returns 401)
    item, _ = test_item_and_auction
    response = client.post(f"/api/v1/items/{item.id}/bid", json={"amount": 150.0})
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_place_bid_amount_too_low(test_item_and_auction, test_user_and_token):
    # AC: The bid amount must be higher than the current highest bid by at least $10.
    item, _ = test_item_and_auction
    _, token = test_user_and_token

    # Place first bid of 150.0
    client.post(
        f"/api/v1/items/{item.id}/bid",
        json={"amount": 150.0},
        headers={"Authorization": f"Bearer {token}"},
    )

    # Try to place second bid of 155.0 (only $5 higher, should fail)
    response = client.post(
        f"/api/v1/items/{item.id}/bid",
        json={"amount": 155.0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Bid amount must be higher than current highest bid by at least $10"
    )


def test_place_bid_auction_ended(db_session, test_user_and_token):
    # AC: Auction has already ended returns 400
    user, token = test_user_and_token

    # Create an item
    item = models.Item(name="Ended Vase", description="Vase", seller_id=user.id)
    db_session.add(item)
    db_session.commit()

    # Create an ended auction
    auction = models.Auction(
        item_id=item.id,
        start_time=datetime.now(timezone.utc) - timedelta(hours=2),
        end_time=datetime.now(timezone.utc) - timedelta(hours=1),
        starting_price=100.0,
        current_highest_bid=None,
        status="active",
    )
    db_session.add(auction)
    db_session.commit()

    response = client.post(
        f"/api/v1/items/{item.id}/bid",
        json={"amount": 150.0},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Auction has already ended"


def test_websocket_connection(test_item_and_auction):
    # AC: Establishes a WebSocket connection for real-time bid updates on an item.
    item, _ = test_item_and_auction
    with client.websocket_connect(f"/ws/items/{item.id}"):
        # Connection successful
        pass
