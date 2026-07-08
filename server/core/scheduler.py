# Scheduler module for daily aggregation of round-ups.
# In a production environment, this would run as a background task or cron job.
import logging
from server.database import SessionLocal
from server.api.v1.endpoints.roundups import trigger_daily_job

logger = logging.getLogger(__name__)


def run_daily_aggregation():
    logger.info("Starting daily round-up aggregation job...")
    db = SessionLocal()
    try:
        result = trigger_daily_job(db)
        logger.info(f"Daily job completed successfully: {result}")
    except Exception as e:
        logger.error(f"Daily job failed: {e}")
    finally:
        db.close()
