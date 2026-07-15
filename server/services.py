import math


def calculate_reducing_balance_emi(
    loan_amount: float, annual_interest_rate: float, tenure_months: int
) -> dict:
    """
    EMI = [P x R x (1+R)^N]/[((1+R)^N)-1]
    where P = Loan amount, R = Interest rate per month, N = Tenure in months.
    """
    P = loan_amount
    R = (annual_interest_rate / 12) / 100
    N = tenure_months

    if R == 0:
        emi = P / N
    else:
        emi = (P * R * math.pow(1 + R, N)) / (math.pow(1 + R, N) - 1)

    total_repayment = emi * N
    total_interest = total_repayment - P

    return {
        "emi": round(emi, 2),
        "total_interest": round(total_interest, 2),
        "total_repayment": round(total_repayment, 2),
    }


def query_credit_bureau(customer_id: str) -> int:
    """
    Simulates querying an external credit bureau API.
    Returns a credit score between 300 and 850.
    If the service is 'unavailable' (simulated), returns None or raises an exception.
    """
    # For testing/simulation, we can return a standard score.
    # If customer_id has a specific pattern, we can simulate unavailability.
    if "fail" in str(customer_id).lower() or "unavailable" in str(customer_id).lower():
        raise ConnectionError("Credit Bureau API is offline")
    return 720


def send_status_notification(customer_id: str, application_id: str, status: str):
    """
    Simulates sending a notification to the customer about status changes.
    """
    print(
        f"Notification sent to customer {customer_id}: Application {application_id} is now {status}"
    )
