from typing import Optional, Dict, Any

class CBSService:
    # Mock database of accounts in CBS
    MOCK_ACCOUNTS = {
        "1002948571": {
            "customer_id": "CUST-99281",
            "account_holder_name": "John Doe",
            "balance": 154200.50,
            "currency": "INR",
            "branch": "Mumbai Main Branch",
            "account_type": "Savings"
        },
        "2003948572": {
            "customer_id": "CUST-88372",
            "account_holder_name": "Jane Smith",
            "balance": 4500000.00,
            "currency": "INR",
            "branch": "Delhi Connaught Place Branch",
            "account_type": "Current"
        }
    }

    @classmethod
    def fetch_account_details(cls, account_number: str) -> Optional[Dict[str, Any]]:
        """
        Fetches account details from the Core Banking System (CBS).
        Returns None if the account is not found.
        """
        return cls.MOCK_ACCOUNTS.get(account_number)
