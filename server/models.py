import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, LargeBinary
from sqlalchemy.sql import func
from server.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    master_password_hash = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    failed_login_attempts = Column(Integer, nullable=False, default=0)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )


class Credential(Base):
    __tablename__ = "credentials"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title_encrypted = Column(LargeBinary, nullable=False)
    username_encrypted = Column(LargeBinary, nullable=False)
    password_encrypted = Column(LargeBinary, nullable=False)
    url_encrypted = Column(LargeBinary, nullable=True)
    iv = Column(LargeBinary, nullable=False)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
