from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Import Base and get_db from database
from server.database import Base, get_db
from server.main import app, seed_data

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables and seed data
Base.metadata.create_all(bind=engine)
db = TestingSessionLocal()
seed_data(db)
db.close()


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Apply dependency overrides to the app
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)
