# Mock services for external systems (CBS and BBPS)
import uuid
from typing import Dict, Tuple

# In-memory mock database for savings accounts to simulate CBS
# Account number -> balance
MOCK_CBS_ACCOUNTS: Dict[str, float] = {
    "1234567890": 5000.00,
    "9876543210": 150.00,
    "5555555555": 10.00,
}

# Mock BBPS biller directory
VALID_OPERATORS = {
    "Airtel": "B_AIRTEL_01",
    "Jio": "B_JIO_02",
    "Vi": "B_VI_03",
    "Tata Sky": "B_TATASKY_04",
    "Dish TV": "B_DISHTV_05",
}


def validate_operator_bbps(account_number: str, operator_name: str) -> Tuple[bool, str]:
    """
    Validates operator and account number against BBPS.
    Returns (is_valid, biller_id)
    """
    if not account_number or len(account_number) < 5:
        return False, ""

    if operator_name in VALID_OPERATORS:
        return True, VALID_OPERATORS[operator_name]

    return False, ""


def debit_savings_account(account_number: str, amount: float) -> bool:
    """
    Simulates debiting the savings account in CBS.
    Returns True if successful, False if insufficient funds or account not found.
    """
    if account_number not in MOCK_CBS_ACCOUNTS:
        return False

    if MOCK_CBS_ACCOUNTS[account_number] < amount:
        return False

    MOCK_CBS_ACCOUNTS[account_number] -= amount
    return True


def rollback_savings_account_debit(account_number: str, amount: float) -> None:
    """
    Reverses a previous debit in CBS.
    """
    if account_number in MOCK_CBS_ACCOUNTS:
        MOCK_CBS_ACCOUNTS[account_number] += amount


def process_bbps_recharge(
    account_number: str, operator_name: str, amount: float
) -> Tuple[bool, str, str]:
    """
    Simulates processing the recharge via BBPS network.
    Returns (success, bbps_ref_id, operator_ref_id)
    """
    # Simulate a failure scenario for a specific mock account or amount if needed
    if amount == 9999.00:
        return False, "", ""

    bbps_ref = f"BBPS{uuid.uuid4().hex[:12].upper()}"
    op_ref = f"OP{uuid.uuid4().hex[:12].upper()}"
    return True, bbps_ref, op_ref
