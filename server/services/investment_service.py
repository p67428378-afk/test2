# Investment Service Mock / Integration
import logging

logger = logging.getLogger(__name__)


class InvestmentService:
    def execute_investment(self, user_id: str, amount: float, retries: int = 3) -> bool:
        """
        Mock executing an investment transaction with a brokerage API.
        Supports a configurable number of retries.
        """
        for attempt in range(1, retries + 1):
            try:
                logger.info(
                    f"Attempting to invest ${amount:.2f} for user {user_id} (Attempt {attempt}/{retries})"
                )
                # Simulate successful investment
                return True
            except Exception as e:
                logger.error(f"Investment attempt {attempt} failed: {str(e)}")
                if attempt == retries:
                    # Alert support / log critical error
                    logger.critical(
                        f"CRITICAL: Investment of ${amount:.2f} for user {user_id} failed after {retries} attempts."
                    )
                    raise e
        return False


investment_service = InvestmentService()
