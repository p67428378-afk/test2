import requests
from server.core.config import settings

def get_loan_details(loan_account_number: str):
    """
    Mocks a call to the Loan Management System (LMS) to get loan details.
    In a real application, this would make an HTTP request to the LMS.
    """
    if loan_account_number == "HL123456789":
        return {
            "property_value": 500000,
            "outstanding_loan": 50000,
            "repayment_history": "good"
        }
    elif loan_account_number == "HL987654321":
        return {
            "property_value": 500000,
            "outstanding_loan": 400000,
            "repayment_history": "good"
        }
    elif loan_account_number == "HL111222333":
        return {
            "property_value": 500000,
            "outstanding_loan": 50000,
            "repayment_history": "poor"
        }
    else:
        return None

def check_eligibility(loan_account_number: str):
    """
    Checks the eligibility for a top-up loan based on the loan details.
    """
    loan_details = get_loan_details(loan_account_number)

    if not loan_details:
        return {"eligible": False, "reason": "Loan account not found"}

    if loan_details["repayment_history"] == "poor":
        return {"eligible": False, "reason": "Poor repayment track record"}

    ltv_limit = 0.20
    property_value = loan_details["property_value"]
    outstanding_loan = loan_details["outstanding_loan"]

    max_loan_amount = property_value * ltv_limit
    eligible_amount = max_loan_amount - outstanding_loan

    if eligible_amount <= 0:
        return {"eligible": False, "reason": "Current outstanding exceeds LTV limit."}

    return {"eligible": True, "eligible_amount": eligible_amount}
