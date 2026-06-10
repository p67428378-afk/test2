import pytest
import io
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.main import app
from server.database import Base, get_db
from server import crud, models

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
def clean_db():
    # Clear tables before each test
    db = TestingSessionLocal()
    db.query(models.Author).delete()
    db.query(models.Revision).delete()
    db.query(models.Manuscript).delete()
    db.query(models.Stylesheet).delete()
    db.commit()
    db.close()


def test_upload_manuscript():
    file_content = (
        b"Title: Quantum Computing\nAbstract: This is a study on quantum computing."
    )
    file = io.BytesIO(file_content)
    response = client.post(
        "/api/v1/manuscripts",
        files={"file": ("quantum_computing.txt", file, "text/plain")},
    )
    assert response.status_code == 201
    data = response.json()
    assert "manuscript_id" in data
    assert data["title"] == "Quantum Computing"
    assert data["abstract"] == "This is a study on quantum computing."
    assert data["status"] == "draft"


def test_upload_manuscript_invalid_type():
    file = io.BytesIO(b"some content")
    response = client.post(
        "/api/v1/manuscripts", files={"file": ("invalid.png", file, "image/png")}
    )
    assert response.status_code == 400
    assert "Only PDF, TXT, DOCX, and DOC are allowed" in response.json()["detail"]


def test_get_manuscripts():
    # Upload one first
    file = io.BytesIO(b"content")
    client.post("/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")})

    response = client.get("/api/v1/manuscripts")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


def test_get_manuscript_details():
    file = io.BytesIO(b"content")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    response = client.get(f"/api/v1/manuscripts/{m_id}")
    assert response.status_code == 200
    assert response.json()["manuscript_id"] == m_id


def test_get_manuscript_not_found():
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/manuscripts/{random_id}")
    assert response.status_code == 404


def test_update_manuscript():
    file = io.BytesIO(b"content")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    response = client.put(
        f"/api/v1/manuscripts/{m_id}",
        json={
            "title": "Updated Title",
            "abstract": "Updated Abstract",
            "status": "submitted",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["abstract"] == "Updated Abstract"
    assert data["status"] == "submitted"


def test_update_manuscript_invalid():
    file = io.BytesIO(b"content")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    response = client.put(f"/api/v1/manuscripts/{m_id}", json={"title": "   "})
    assert response.status_code == 400


def test_invite_collaborator():
    file = io.BytesIO(b"content")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    response = client.post(
        f"/api/v1/manuscripts/{m_id}/collaborators",
        json={"email": "coauthor@example.com", "role": "co-author"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "coauthor@example.com"
    assert data["role"] == "co-author"
    assert data["status"] == "pending"


def test_invite_collaborator_duplicate():
    file = io.BytesIO(b"content")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    client.post(
        f"/api/v1/manuscripts/{m_id}/collaborators",
        json={"email": "coauthor@example.com", "role": "co-author"},
    )

    response = client.post(
        f"/api/v1/manuscripts/{m_id}/collaborators",
        json={"email": "coauthor@example.com", "role": "co-author"},
    )
    assert response.status_code == 400


def test_list_collaborators():
    file = io.BytesIO(b"content")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    client.post(
        f"/api/v1/manuscripts/{m_id}/collaborators",
        json={"email": "coauthor@example.com", "role": "co-author"},
    )

    response = client.get(f"/api/v1/manuscripts/{m_id}/collaborators")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_compliance_check():
    # Create stylesheet
    rules = {"max_title_length": 50, "min_abstract_length": 10}
    sheet_resp = client.post("/api/v1/stylesheets?name=TestStyle", json=rules)
    sheet_id = sheet_resp.json()["stylesheet_id"]

    # Upload manuscript
    file = io.BytesIO(b"Title: Short Title\nAbstract: This is a long enough abstract.")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    response = client.post(
        f"/api/v1/manuscripts/{m_id}/compliance-check", json={"stylesheet_id": sheet_id}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "passed"
    assert len(data["errors"]) == 0


def test_revisions_and_rebuttal():
    # Upload manuscript
    file = io.BytesIO(b"content")
    upload_resp = client.post(
        "/api/v1/manuscripts", files={"file": ("test.txt", file, "text/plain")}
    )
    m_id = upload_resp.json()["manuscript_id"]

    # Create a revision critique manually in DB
    db = TestingSessionLocal()
    crud.create_revision(
        db=db, manuscript_id=uuid.UUID(m_id), reviewer_comment="Fix formatting"
    )
    db.close()

    # Get revisions
    response = client.get(f"/api/v1/manuscripts/{m_id}/revisions")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["reviewer_comment"] == "Fix formatting"

    rev_id = response.json()[0]["revision_id"]

    # Submit rebuttal
    rebuttal_resp = client.post(
        f"/api/v1/manuscripts/{m_id}/revisions/{rev_id}/rebuttal",
        json={
            "author_rebuttal": "I have fixed the formatting.",
            "text_link": "http://example.com/diff",
        },
    )
    assert rebuttal_resp.status_code == 200
    assert rebuttal_resp.json()["author_rebuttal"] == "I have fixed the formatting."
    assert rebuttal_resp.json()["text_link"] == "http://example.com/diff"
