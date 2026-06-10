from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from server.app import models, schemas

# --- Body CRUD ---
def create_body(db: Session, body: schemas.BodyCreate) -> models.Body:
    db_body = models.Body(
        first_name=body.first_name,
        last_name=body.last_name,
        date_of_death=body.date_of_death,
        intake_date=body.intake_date,
        release_date=body.release_date,
        status=body.status,
        location=body.location
    )
    db.add(db_body)
    db.commit()
    db.refresh(db_body)
    return db_body

def get_body(db: Session, body_id: UUID) -> Optional[models.Body]:
    return db.query(models.Body).filter(models.Body.body_id == body_id).first()

def get_bodies(db: Session, skip: int = 0, limit: int = 20, status: Optional[str] = None, location: Optional[str] = None) -> List[models.Body]:
    query = db.query(models.Body)
    filters = []
    if status:
        filters.append(models.Body.status == status)
    if location:
        filters.append(models.Body.location == location)
    if filters:
        query = query.filter(and_(*filters))
    return query.offset(skip).limit(limit).all()

def update_body(db: Session, body_id: UUID, body_update: schemas.BodyUpdate) -> Optional[models.Body]:
    db_body = get_body(db, body_id)
    if not db_body:
        return None
    
    update_data = body_update.model_dump(exclude_unset=True) if hasattr(body_update, "model_dump") else body_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_body, key, value)
    
    db_body.updated_at = datetime.now()
    db.commit()
    db.refresh(db_body)
    return db_body


# --- Funeral CRUD ---
def create_funeral(db: Session, funeral: schemas.FuneralCreate) -> models.Funeral:
    db_funeral = models.Funeral(
        body_id=funeral.body_id,
        service_type=funeral.service_type,
        service_date=funeral.service_date,
        notes=funeral.notes,
        assigned_resources=funeral.assigned_resources,
        status=funeral.status
    )
    db.add(db_funeral)
    db.commit()
    db.refresh(db_funeral)
    return db_funeral

def get_funeral(db: Session, funeral_id: UUID) -> Optional[models.Funeral]:
    return db.query(models.Funeral).filter(models.Funeral.funeral_id == funeral_id).first()

def get_funerals(db: Session, skip: int = 0, limit: int = 20) -> List[models.Funeral]:
    return db.query(models.Funeral).offset(skip).limit(limit).all()

def update_funeral(db: Session, funeral_id: UUID, funeral_update: schemas.FuneralUpdate) -> Optional[models.Funeral]:
    db_funeral = get_funeral(db, funeral_id)
    if not db_funeral:
        return None
    
    update_data = funeral_update.model_dump(exclude_unset=True) if hasattr(funeral_update, "model_dump") else funeral_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_funeral, key, value)
        
    db_funeral.updated_at = datetime.now()
    db.commit()
    db.refresh(db_funeral)
    return db_funeral


# --- Invoice CRUD ---
def create_invoice(db: Session, invoice: schemas.InvoiceCreate) -> models.Invoice:
    db_invoice = models.Invoice(
        funeral_id=invoice.funeral_id,
        total_amount=invoice.total_amount,
        paid_amount=invoice.paid_amount,
        status=invoice.status
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    
    for item in invoice.items:
        db_item = models.InvoiceItem(
            invoice_id=db_invoice.invoice_id,
            description=item.description,
            amount=item.amount
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def get_invoice(db: Session, invoice_id: UUID) -> Optional[models.Invoice]:
    return db.query(models.Invoice).filter(models.Invoice.invoice_id == invoice_id).first()

def get_invoices(db: Session, skip: int = 0, limit: int = 20) -> List[models.Invoice]:
    return db.query(models.Invoice).offset(skip).limit(limit).all()

def update_invoice(db: Session, invoice_id: UUID, invoice_update: schemas.InvoiceUpdate) -> Optional[models.Invoice]:
    db_invoice = get_invoice(db, invoice_id)
    if not db_invoice:
        return None
    
    update_data = invoice_update.model_dump(exclude_unset=True) if hasattr(invoice_update, "model_dump") else invoice_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_invoice, key, value)
        
    db_invoice.updated_at = datetime.now()
    db.commit()
    db.refresh(db_invoice)
    return db_invoice
