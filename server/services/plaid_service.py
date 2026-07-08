# Plaid Service Mock / Integration
from typing import List, Dict, Any
from datetime import date
import random


class PlaidService:
    def fetch_new_transactions(
        self, access_token: str, start_date: date, end_date: date
    ) -> List[Dict[str, Any]]:
        """
        Mock fetching transactions from Plaid.
        In a real app, this would call the Plaid API.
        """
        # Return some mock transactions for testing/demo purposes
        merchants = [
            "Starbucks Coffee",
            "Whole Foods Market",
            "Uber Ride",
            "Steam Games",
            "Chevron Gas",
        ]
        mock_txs = []
        for i, merchant in enumerate(merchants):
            # Generate random amounts
            amount = round(random.uniform(1.0, 50.0), 2)
            # Calculate roundup
            next_dollar = float(int(amount) + 1)
            roundup = round(next_dollar - amount, 2)
            if roundup == 1.0:
                roundup = 0.0

            mock_txs.append(
                {
                    "plaid_transaction_id": f"plaid_tx_{start_date}_{i}",
                    "merchant_name": merchant,
                    "amount": amount,
                    "roundup_amount": roundup,
                    "transaction_date": start_date,
                }
            )
        return mock_txs


plaid_service = PlaidService()
