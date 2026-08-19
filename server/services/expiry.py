import logging
from server.database import SessionLocal
from server.crud import evaluate_all_warranties

logger = logging.getLogger("expiry_daemon")


def run_expiry_evaluation():
    """Run daily evaluation of all product warranties."""
    db = SessionLocal()
    try:
        updated_count = evaluate_all_warranties(db)
        logger.info(
            f"Expiry evaluation complete. Updated {updated_count} warranty statuses."
        )
        return updated_count
    finally:
        db.close()
