"""
Module: server/services/aml_service.py
Purpose: Automated AML flagging for high-risk transactions
"""


class AMLService:
    HIGH_RISK_JURISDICTIONS = {
        "high-risk country",
        "jurisdiction-x",
        "iran",
        "north korea",
        "russia",
        "syria",
        "cuba",
    }

    @classmethod
    def screen_transaction(cls, amount: float, country: str) -> str:
        """
        Screen transaction for AML flagging.
        Returns 'FLAGGED' if amount > 10000 and country is high-risk, otherwise 'CLEARED'.
        """
        if amount > 10000 and country.lower() in cls.HIGH_RISK_JURISDICTIONS:
            return "FLAGGED"
        return "CLEARED"
