from datetime import date
from typing import Optional
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
import server.models as models


def calculate_end_date(purchase_date: date, duration_months: int) -> date:
    """Calculates warranty end date given purchase_date and duration in months."""
    return purchase_date + relativedelta(months=duration_months)


def calculate_warranty_status(
    end_date: date, reference_date: Optional[date] = None
) -> str:
    """Calculates warranty status relative to reference_date (default: today)."""
    if reference_date is None:
        reference_date = date.today()

    if end_date < reference_date:
        return "EXPIRED"
    elif (end_date - reference_date).days <= 30:
        return "EXPIRING_SOON"
    else:
        return "ACTIVE"


def evaluate_all_warranties(db: Session) -> dict:
    """Evaluates and updates status for all registered warranties."""
    warranties = db.query(models.Warranty).all()
    today = date.today()
    evaluated_count = len(warranties)
    updated_count = 0

    for warranty in warranties:
        new_status = calculate_warranty_status(warranty.end_date, today)
        if warranty.status != new_status:
            warranty.status = new_status
            updated_count += 1

    if updated_count > 0:
        db.commit()

    return {
        "evaluated_count": evaluated_count,
        "updated_count": updated_count,
        "message": f"Successfully evaluated {evaluated_count} warranties. Updated {updated_count} statuses.",
    }


def get_warranty_stats(db: Session) -> dict:
    """Computes total product count and counts by warranty status."""
    total_products = db.query(models.Product).count()

    # Recalculate status dynamically to ensure real-time accuracy
    warranties = db.query(models.Warranty).all()
    today = date.today()

    active_count = 0
    expiring_soon_count = 0
    expired_count = 0

    for w in warranties:
        current_status = calculate_warranty_status(w.end_date, today)
        if current_status == "ACTIVE":
            active_count += 1
        elif current_status == "EXPIRING_SOON":
            expiring_soon_count += 1
        elif current_status == "EXPIRED":
            expired_count += 1

    return {
        "total_products": total_products,
        "active": active_count,
        "expiring_soon": expiring_soon_count,
        "expired": expired_count,
    }
