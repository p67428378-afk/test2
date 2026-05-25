from sqlalchemy.orm import Session
from backend import models

def test_create_user(db_session: Session):
    user = models.User(username="testuser", email="test@example.com", hashed_password="hashedpassword")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.username == "testuser"
    assert user.email == "test@example.com"

    retrieved_user = db_session.query(models.User).filter(models.User.email == "test@example.com").first()
    assert retrieved_user is not None
    assert retrieved_user.username == "testuser"
