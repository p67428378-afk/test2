from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID
from typing import List, Optional


# Existing CRUD functions
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()


def get_user_by_mobile_number(db: Session, mobile_number: str):
    return (
        db.query(models.User).filter(models.User.mobile_number == mobile_number).first()
    )


def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
    db_otp = models.OTP(
        user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at
    )
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp


def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()


def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp


def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(
        user_id=user_id, hashed_password=hashed_password
    )
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history


def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# New CRUD functions for Paper Management System


def create_manuscript(
    db: Session,
    title: Optional[str],
    abstract: Optional[str],
    file_path: Optional[str],
    creator_id: UUID,
) -> models.Manuscript:
    db_manuscript = models.Manuscript(
        title=title,
        abstract=abstract,
        file_path=file_path,
        creator_id=creator_id,
        status="draft",
    )
    db.add(db_manuscript)
    db.commit()
    db.refresh(db_manuscript)
    return db_manuscript


def get_manuscript(db: Session, manuscript_id: UUID) -> Optional[models.Manuscript]:
    return (
        db.query(models.Manuscript)
        .filter(models.Manuscript.manuscript_id == manuscript_id)
        .first()
    )


def list_manuscripts(
    db: Session, skip: int = 0, limit: int = 20
) -> List[models.Manuscript]:
    return db.query(models.Manuscript).offset(skip).limit(limit).all()


def update_manuscript(
    db: Session,
    manuscript: models.Manuscript,
    update_data: schemas.ManuscriptUpdateRequest,
) -> models.Manuscript:
    if update_data.title is not None:
        manuscript.title = update_data.title
    if update_data.abstract is not None:
        manuscript.abstract = update_data.abstract
    if update_data.status is not None:
        manuscript.status = update_data.status
    db.commit()
    db.refresh(manuscript)
    return manuscript


def create_collaborator(
    db: Session, manuscript_id: UUID, email: str, role: str
) -> models.Author:
    db_author = models.Author(
        manuscript_id=manuscript_id, email=email, role=role, status="pending"
    )
    db.add(db_author)
    db.commit()
    db.refresh(db_author)
    return db_author


def get_collaborators(db: Session, manuscript_id: UUID) -> List[models.Author]:
    return (
        db.query(models.Author)
        .filter(models.Author.manuscript_id == manuscript_id)
        .all()
    )


def get_collaborator_by_email(
    db: Session, manuscript_id: UUID, email: str
) -> Optional[models.Author]:
    return (
        db.query(models.Author)
        .filter(
            models.Author.manuscript_id == manuscript_id, models.Author.email == email
        )
        .first()
    )


def get_stylesheet(db: Session, stylesheet_id: UUID) -> Optional[models.Stylesheet]:
    return (
        db.query(models.Stylesheet)
        .filter(models.Stylesheet.stylesheet_id == stylesheet_id)
        .first()
    )


def list_stylesheets(db: Session) -> List[models.Stylesheet]:
    return db.query(models.Stylesheet).all()


def create_stylesheet(db: Session, name: str, rules: dict) -> models.Stylesheet:
    db_stylesheet = models.Stylesheet(name=name, rules=rules)
    db.add(db_stylesheet)
    db.commit()
    db.refresh(db_stylesheet)
    return db_stylesheet


def get_revisions(db: Session, manuscript_id: UUID) -> List[models.Revision]:
    return (
        db.query(models.Revision)
        .filter(models.Revision.manuscript_id == manuscript_id)
        .all()
    )


def get_revision(db: Session, revision_id: UUID) -> Optional[models.Revision]:
    return (
        db.query(models.Revision)
        .filter(models.Revision.revision_id == revision_id)
        .first()
    )


def update_revision_rebuttal(
    db: Session, revision: models.Revision, rebuttal: str, text_link: str
) -> models.Revision:
    revision.author_rebuttal = rebuttal
    revision.text_link = text_link
    db.commit()
    db.refresh(revision)
    return revision


def create_revision(
    db: Session, manuscript_id: UUID, reviewer_comment: str
) -> models.Revision:
    db_revision = models.Revision(
        manuscript_id=manuscript_id, reviewer_comment=reviewer_comment
    )
    db.add(db_revision)
    db.commit()
    db.refresh(db_revision)
    return db_revision
