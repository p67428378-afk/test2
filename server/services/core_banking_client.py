
import httpx
from server.core.config import settings

class CoreBankingClient:
    def __init__(self):
        self.api_url = settings.CORE_BANKING_API_URL
        self.api_key = settings.CORE_BANKING_API_KEY

    async def get_customer_age(self, pan: str) -> int:
        # This is a mock. In a real system, this would make an API call.
        # For testing, we'll use a simple logic.
        if pan.startswith("ABC"): 
            return 35 # Below 60
        else:
            return 65 # Senior citizen

    async def link_exemption_to_fds(self, pan: str, submission_id: str) -> bool:
        # Mock: Simulate linking exemption to all FD accounts for the PAN
        print(f"[Core Banking MOCK] Linking exemption for PAN {pan} with submission {submission_id}")
        return True

core_banking_client = CoreBankingClient()
