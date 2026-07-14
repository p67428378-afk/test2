import httpx
import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class CoreInsuranceClient:
    def __init__(self):
        self.base_url = os.getenv(
            "CORE_INSURANCE_API_URL", "https://api.core-insurance.local/v1"
        )
        self.timeout = float(os.getenv("CORE_INSURANCE_TIMEOUT", "2.0"))
        self.threshold = float(os.getenv("ESTIMATE_CONFLICT_THRESHOLD", "15.0"))

    async def get_manual_estimate(
        self, policyholder_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Queries the external Core Insurance System to retrieve any existing manual estimate.
        Includes strict timeout and error handling.
        """
        url = f"{self.base_url}/estimates/manual"
        params = {"policyholder_id": policyholder_id}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    # Expecting: {"amount": 1500.00, "currency": "USD", "date": "2025-10-20"}
                    return data
                elif response.status_code == 404:
                    logger.info(
                        f"No manual estimate found for policyholder {policyholder_id}"
                    )
                    return None
                else:
                    logger.warning(
                        f"Core Insurance API returned status {response.status_code}"
                    )
                    return None
        except httpx.TimeoutException:
            logger.error(
                f"Timeout connecting to Core Insurance API for policyholder {policyholder_id}"
            )
            return None
        except Exception as e:
            logger.error(f"Error querying Core Insurance API: {str(e)}")
            return None

    def check_conflict(self, ai_amount: float, manual_amount: float) -> bool:
        """
        Compares AI estimate with manual estimate.
        Returns True if absolute percentage difference is >= threshold (default 15%).
        """
        if manual_amount <= 0:
            return False
        diff = abs(ai_amount - manual_amount)
        percentage_diff = (diff / manual_amount) * 100.0
        return percentage_diff >= self.threshold


core_insurance_client = CoreInsuranceClient()
