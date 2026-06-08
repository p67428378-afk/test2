
import asyncio
import logging
from sqlalchemy.orm import Session
from server.database import SessionLocal
from server import models

logger = logging.getLogger(__name__)

async def update_fiscal_data_job():
    """
    Simulates fetching data from external APIs (National Revenue Service,
    department expense ledgers, National Bureau of Statistics) and updating
    the database.
    """
    db = SessionLocal()
    try:
        # Simulate updating GDP growth, inflation, etc.
        gdp = db.query(models.AggregatedFiscalData).filter(models.AggregatedFiscalData.metric_name == "gdp_growth_pct").first()
        if gdp:
            gdp.metric_value = 2.4  # or simulate slight variation
            db.commit()
        logger.info("Real-time fiscal data updated successfully.")
    except Exception as e:
        logger.error(f"Failed to update real-time fiscal data: {e}")
    finally:
        db.close()

async def start_scheduler():
    """
    Starts the background scheduler loop.
    """
    logger.info("Starting real-time fiscal data scheduler (15-minute interval)...")
    while True:
        await update_fiscal_data_job()
        await asyncio.sleep(900)  # 15 minutes
