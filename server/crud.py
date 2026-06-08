
from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    # A real application should hash the password
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(username=user.username, email=user.email, hashed_password=fake_hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_client(db: Session, client_id: UUID):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_matters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Matter).offset(skip).limit(limit).all()

def create_matter(db: Session, matter: schemas.MatterCreate):
    db_matter = models.Matter(**matter.dict())
    db.add(db_matter)
    db.commit()
    db.refresh(db_matter)
    return db_matter

def get_document(db: Session, document_id: UUID):
    return db.query(models.Document).filter(models.Document.id == document_id).first()

def create_document(db: Session, document: schemas.DocumentCreate):
    db_document = models.Document(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

def create_time_entry(db: Session, time_entry: schemas.TimeEntryCreate):
    db_time_entry = models.TimeEntry(**time_entry.dict())
    db.add(db_time_entry)
    db.commit()
    db.refresh(db_time_entry)
    return db_time_entry

def get_invoices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Invoice).offset(skip).limit(limit).all()
