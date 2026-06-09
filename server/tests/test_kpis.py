
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server.models.kpi import Kpi
from datetime import date

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

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    kpi_data = Kpi(sales_linear_ft=100, private_brand_percent=20, in_stock_rate=95, shelf_capacity=80, calculation_date=date.today())
    db.add(kpi_data)
    db.commit()
    db.refresh(kpi_data)
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

def test_read_kpis(db_session):
    response = client.get("/api/v1/kpis")
    assert response.status_code == 200
    data = response.json()
    assert data["sales_linear_ft"] == 100
    assert data["private_brand_percent"] == 20
    assert data["in_stock_rate"] == 95
    assert data["shelf_capacity"] == 80
