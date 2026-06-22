from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import Optional, List
from uuid import UUID
from server import models, schemas


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


# Notes App CRUD functions


def get_or_create_tags(db: Session, tag_names: List[str]) -> List[models.Tag]:
    tags = []
    for name in tag_names:
        name_stripped = name.strip()
        if not name_stripped:
            continue
        # Check if tag exists
        tag = db.query(models.Tag).filter(models.Tag.name == name_stripped).first()
        if not tag:
            tag = models.Tag(name=name_stripped)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        tags.append(tag)
    return tags


def get_notes(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    q: Optional[str] = None,
    tag: Optional[str] = None,
) -> List[models.Note]:
    query = db.query(models.Note)

    if q:
        query = query.filter(
            or_(models.Note.title.ilike(f"%{q}%"), models.Note.content.ilike(f"%{q}%"))
        )

    if tag:
        query = query.join(models.Note.tags).filter(models.Tag.name.ilike(tag))

    return query.order_by(models.Note.updated_at.desc()).offset(skip).limit(limit).all()


def get_note_by_id(db: Session, note_id: UUID) -> Optional[models.Note]:
    return db.query(models.Note).filter(models.Note.id == note_id).first()


def create_note(db: Session, note_in: schemas.NoteCreateUpdate) -> models.Note:
    db_note = models.Note(title=note_in.title, content=note_in.content)
    if note_in.tags:
        db_note.tags = get_or_create_tags(db, note_in.tags)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


def update_note(
    db: Session, db_note: models.Note, note_in: schemas.NoteCreateUpdate
) -> models.Note:
    db_note.title = note_in.title
    db_note.content = note_in.content
    db_note.tags = get_or_create_tags(db, note_in.tags)
    db_note.updated_at = func.now()
    db.commit()
    db.refresh(db_note)
    return db_note


def delete_note(db: Session, db_note: models.Note) -> None:
    db.delete(db_note)
    db.commit()


def create_attachment(
    db: Session, note_id: UUID, filename: str, file_size: int, file_path: str
) -> models.Attachment:
    db_attachment = models.Attachment(
        note_id=note_id, filename=filename, file_size=file_size, file_path=file_path
    )
    db.add(db_attachment)
    db.commit()
    db.refresh(db_attachment)
    return db_attachment


def get_attachment_by_id(
    db: Session, attachment_id: UUID
) -> Optional[models.Attachment]:
    return (
        db.query(models.Attachment)
        .filter(models.Attachment.id == attachment_id)
        .first()
    )


def delete_attachment(db: Session, db_attachment: models.Attachment) -> None:
    db.delete(db_attachment)
    db.commit()


def get_all_attachments(db: Session) -> List[models.Attachment]:
    return (
        db.query(models.Attachment).order_by(models.Attachment.created_at.desc()).all()
    )


def get_all_tags(db: Session) -> List[str]:
    tags = db.query(models.Tag.name).order_by(models.Tag.name.asc()).all()
    return [t[0] for t in tags]


def get_stats(db: Session):
    total_notes = db.query(models.Note).count()

    # Active tags are tags associated with at least one note
    active_tags = db.query(models.Tag).join(models.Note.tags).distinct().count()

    storage_usage = db.query(func.sum(models.Attachment.file_size)).scalar()
    storage_usage_bytes = int(storage_usage) if storage_usage is not None else 0

    return {
        "total_notes": total_notes,
        "active_tags": active_tags,
        "storage_usage_bytes": storage_usage_bytes,
    }
