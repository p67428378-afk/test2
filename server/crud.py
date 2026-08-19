from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from server.models import (
    Product,
    Warranty,
    Claim,
    Receipt,
    ClaimAuditLog,
    NotificationLog,
)
from server.schemas import ProductCreate, ProductUpdate, ClaimCreate, ClaimStatusUpdate


def calculate_end_date(start_date: date, duration_months: int) -> date:
    """Calculate warranty end_date given start_date and duration in months."""
    year = start_date.year + (start_date.month + duration_months - 1) // 12
    month = (start_date.month + duration_months - 1) % 12 + 1
    # Handle end of month day overflow (e.g. Feb 30 -> Feb 28)
    day = min(
        start_date.day,
        [
            31,
            29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31,
        ][month - 1],
    )
    return date(year, month, day)


def determine_warranty_status(end_date: date, today: Optional[date] = None) -> str:
    """Determine warranty status based on end_date and today's date."""
    if today is None:
        today = date.today()
    days_left = (end_date - today).days
    if days_left < 0:
        return "EXPIRED"
    elif days_left <= 30:
        return "EXPIRING_SOON"
    else:
        return "ACTIVE"


# Product CRUD
def create_product(db: Session, product_in: ProductCreate) -> Product:
    start_date = product_in.purchase_date
    end_date = calculate_end_date(start_date, product_in.duration_months)
    status = determine_warranty_status(end_date)

    db_product = Product(
        product_name=product_in.product_name,
        serial_number=product_in.serial_number,
        brand=product_in.brand,
        category=product_in.category,
        purchase_date=product_in.purchase_date,
    )
    db.add(db_product)
    db.flush()

    db_warranty = Warranty(
        product_id=db_product.id,
        duration_months=product_in.duration_months,
        start_date=start_date,
        end_date=end_date,
        status=status,
        vendor_name=product_in.vendor_name,
    )
    db.add(db_warranty)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_product(db: Session, product_id: str) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
) -> List[Product]:
    query = db.query(Product).join(Warranty, Product.id == Warranty.product_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.product_name.ilike(search_pattern),
                Product.serial_number.ilike(search_pattern),
                Product.brand.ilike(search_pattern),
                Product.category.ilike(search_pattern),
                Warranty.vendor_name.ilike(search_pattern),
            )
        )

    if status:
        query = query.filter(Warranty.status == status.upper())

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))

    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))

    return query.offset(skip).limit(limit).all()


def update_product(
    db: Session, product_id: str, product_in: ProductUpdate
) -> Optional[Product]:
    product = get_product(db, product_id)
    if not product:
        return None

    if product_in.product_name is not None:
        product.product_name = product_in.product_name
    if product_in.brand is not None:
        product.brand = product_in.brand
    if product_in.category is not None:
        product.category = product_in.category

    if product_in.vendor_name is not None and product.warranty:
        product.warranty.vendor_name = product_in.vendor_name

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: str) -> bool:
    product = get_product(db, product_id)
    if not product:
        return False
    db.delete(product)
    db.commit()
    return True


# Claims CRUD
def create_claim(
    db: Session, claim_in: ClaimCreate, performed_by: Optional[str] = "User"
) -> Claim:
    db_claim = Claim(
        product_id=claim_in.product_id,
        claim_date=claim_in.claim_date,
        issue_description=claim_in.issue_description,
        service_provider=claim_in.service_provider,
        status="PENDING",
        repair_cost=0.0,
    )
    db.add(db_claim)
    db.flush()

    # Create audit log entry
    audit_log = ClaimAuditLog(
        claim_id=db_claim.id,
        action="CLAIM_CREATED",
        from_status=None,
        to_status="PENDING",
        performed_by=performed_by,
        notes=f"Claim submitted for product {claim_in.product_id}",
    )
    db.add(audit_log)
    db.commit()
    db.refresh(db_claim)
    return db_claim


def get_claim(db: Session, claim_id: str) -> Optional[Claim]:
    return db.query(Claim).filter(Claim.id == claim_id).first()


def get_claims(
    db: Session,
    product_id: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[Claim]:
    query = db.query(Claim)
    if product_id:
        query = query.filter(Claim.product_id == product_id)
    if status:
        query = query.filter(Claim.status == status.upper())
    return query.order_by(Claim.created_at.desc()).offset(skip).limit(limit).all()


def update_claim_status(
    db: Session,
    claim_id: str,
    update_in: ClaimStatusUpdate,
    performed_by: Optional[str] = "Admin",
) -> Optional[Claim]:
    claim = get_claim(db, claim_id)
    if not claim:
        return None

    old_status = claim.status
    new_status = update_in.status.upper()

    claim.status = new_status
    if update_in.resolution_notes is not None:
        claim.resolution_notes = update_in.resolution_notes
    if update_in.repair_cost is not None:
        claim.repair_cost = update_in.repair_cost

    audit_log = ClaimAuditLog(
        claim_id=claim.id,
        action="STATUS_UPDATED",
        from_status=old_status,
        to_status=new_status,
        performed_by=performed_by,
        notes=update_in.resolution_notes,
    )
    db.add(audit_log)
    db.commit()
    db.refresh(claim)
    return claim


def get_claim_audit_logs(db: Session, claim_id: str) -> List[ClaimAuditLog]:
    return (
        db.query(ClaimAuditLog)
        .filter(ClaimAuditLog.claim_id == claim_id)
        .order_by(ClaimAuditLog.created_at.asc())
        .all()
    )


# Receipt / Document CRUD
def create_receipt(
    db: Session,
    product_id: str,
    file_name: str,
    file_path: str,
    mime_type: str,
    file_size_bytes: int,
) -> Receipt:
    receipt = Receipt(
        product_id=product_id,
        file_name=file_name,
        file_path=file_path,
        mime_type=mime_type,
        file_size_bytes=file_size_bytes,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return receipt


def get_receipt(db: Session, receipt_id: str) -> Optional[Receipt]:
    return db.query(Receipt).filter(Receipt.id == receipt_id).first()


# Warranty Status Refresh
def evaluate_all_warranties(db: Session) -> int:
    today = date.today()
    warranties = db.query(Warranty).all()
    updated_count = 0

    for w in warranties:
        new_status = determine_warranty_status(w.end_date, today)
        if w.status != new_status:
            w.status = new_status
            updated_count += 1

        # Check milestones for notifications
        days_left = (w.end_date - today).days
        milestone = None
        if days_left == 30:
            milestone = "30_DAY"
        elif days_left == 14:
            milestone = "14_DAY"
        elif days_left == 1:
            milestone = "1_DAY"

        if milestone:
            # Check if milestone notification already sent
            already_sent = (
                db.query(NotificationLog)
                .filter(
                    NotificationLog.product_id == w.product_id,
                    NotificationLog.milestone == milestone,
                )
                .first()
            )
            if not already_sent:
                notif = NotificationLog(
                    product_id=w.product_id,
                    milestone=milestone,
                    message=f"Warranty for product {w.product_id} expires in {days_left} day(s).",
                )
                db.add(notif)

    db.commit()
    return updated_count
