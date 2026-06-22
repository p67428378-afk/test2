import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from server.main import app
from server.database import Base, get_db
import os
import shutil

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    # Create an in-memory SQLite database with StaticPool
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    yield

    # Clean up
    app.dependency_overrides.clear()
    if os.path.exists("uploads"):
        try:
            shutil.rmtree("uploads")
        except Exception:
            pass


def test_create_note():
    response = client.post(
        "/api/v1/notes",
        json={
            "title": "Test Note",
            "content": "This is a test note",
            "tags": ["work", "personal"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Note"
    assert data["content"] == "This is a test note"
    assert set(data["tags"]) == {"work", "personal"}
    assert "id" in data


def test_read_notes():
    # Create two notes
    client.post(
        "/api/v1/notes",
        json={"title": "Work Note", "content": "Work content", "tags": ["work"]},
    )
    client.post(
        "/api/v1/notes",
        json={
            "title": "Personal Note",
            "content": "Personal content",
            "tags": ["personal"],
        },
    )

    # Get all notes
    response = client.get("/api/v1/notes")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2

    # Search notes
    response = client.get("/api/v1/notes?q=Work")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Work Note"

    # Filter by tag
    response = client.get("/api/v1/notes?tag=personal")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Personal Note"


def test_read_note_by_id():
    create_response = client.post(
        "/api/v1/notes",
        json={
            "title": "Specific Note",
            "content": "Specific content",
            "tags": ["ideas"],
        },
    )
    note_id = create_response.json()["id"]

    response = client.get(f"/api/v1/notes/{note_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Specific Note"
    assert data["tags"] == ["ideas"]
    assert data["attachments"] == []


def test_read_note_not_found():
    response = client.get("/api/v1/notes/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_update_note():
    create_response = client.post(
        "/api/v1/notes",
        json={"title": "Old Title", "content": "Old content", "tags": ["old"]},
    )
    note_id = create_response.json()["id"]

    response = client.put(
        f"/api/v1/notes/{note_id}",
        json={
            "title": "New Title",
            "content": "New content",
            "tags": ["new", "updated"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Title"
    assert data["content"] == "New content"
    assert set(data["tags"]) == {"new", "updated"}


def test_delete_note():
    create_response = client.post(
        "/api/v1/notes", json={"title": "To Delete", "content": "Delete me"}
    )
    note_id = create_response.json()["id"]

    response = client.delete(f"/api/v1/notes/{note_id}")
    assert response.status_code == 200
    assert response.json() == {"status": "success"}

    # Verify deleted
    get_response = client.get(f"/api/v1/notes/{note_id}")
    assert get_response.status_code == 404


def test_attachments_management():
    create_response = client.post(
        "/api/v1/notes", json={"title": "Note with Attachment", "content": "Content"}
    )
    note_id = create_response.json()["id"]

    # Upload attachment
    files = {"file": ("test_file.txt", b"Hello World")}
    upload_response = client.post(f"/api/v1/notes/{note_id}/attachments", files=files)
    assert upload_response.status_code == 200
    att_data = upload_response.json()
    assert att_data["filename"] == "test_file.txt"
    assert att_data["file_size"] == 11
    assert "id" in att_data

    att_id = att_data["id"]

    # Get note details to verify attachment is listed
    note_response = client.get(f"/api/v1/notes/{note_id}")
    assert note_response.status_code == 200
    note_data = note_response.json()
    assert len(note_data["attachments"]) == 1
    assert note_data["attachments"][0]["filename"] == "test_file.txt"

    # Get recent attachments
    recent_response = client.get("/api/v1/attachments")
    assert recent_response.status_code == 200
    recent_data = recent_response.json()
    assert len(recent_data) == 1
    assert recent_data[0]["filename"] == "test_file.txt"
    assert recent_data[0]["note_title"] == "Note with Attachment"

    # Delete attachment
    delete_response = client.delete(f"/api/v1/attachments/{att_id}")
    assert delete_response.status_code == 200
    assert delete_response.json() == {"status": "success"}

    # Verify deleted from note
    note_response = client.get(f"/api/v1/notes/{note_id}")
    assert note_response.json()["attachments"] == []


def test_stats_and_tags():
    # Create notes with tags and attachments
    client.post(
        "/api/v1/notes",
        json={"title": "Note 1", "content": "Content 1", "tags": ["tag1", "tag2"]},
    )
    create_response = client.post(
        "/api/v1/notes",
        json={"title": "Note 2", "content": "Content 2", "tags": ["tag2", "tag3"]},
    )
    note_id = create_response.json()["id"]

    # Upload an attachment
    files = {"file": ("doc.pdf", b"Some PDF content")}
    client.post(f"/api/v1/notes/{note_id}/attachments", files=files)

    # Get unique tags
    tags_response = client.get("/api/v1/tags")
    assert tags_response.status_code == 200
    assert set(tags_response.json()) == {"tag1", "tag2", "tag3"}

    # Get stats
    stats_response = client.get("/api/v1/stats")
    assert stats_response.status_code == 200
    stats_data = stats_response.json()
    assert stats_data["total_notes"] == 2
    assert stats_data["active_tags"] == 3
    assert stats_data["storage_usage_bytes"] == 16
