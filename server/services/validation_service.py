
from server.services.core_banking_client import core_banking_client

# Constants based on Income Tax Act
SENIOR_CITIZEN_AGE = 60
FORM_15G_INCOME_LIMIT = 250000
FORM_15H_INCOME_LIMIT = 500000 # For senior citizens

class ValidationService:
    async def validate_eligibility(self, pan: str, declared_income: float) -> tuple[bool, str, str]:
        """
        Validates if a customer is eligible for TDS exemption.
        Returns: (is_eligible, form_type, reason)
        """
        try:
            age = await core_banking_client.get_customer_age(pan)

            if age >= SENIOR_CITIZEN_AGE:
                form_type = '15H'
                if declared_income <= FORM_15H_INCOME_LIMIT:
                    return True, form_type, ""
                else:
                    return False, form_type, f"Declared income exceeds the senior citizen limit of ₹{FORM_15H_INCOME_LIMIT}."
            else:
                form_type = '15G'
                if declared_income <= FORM_15G_INCOME_LIMIT:
                    return True, form_type, ""
                else:
                    return False, form_type, f"Declared income exceeds the general limit of ₹{FORM_15G_INCOME_LIMIT}."

        except Exception as e:
            # Handle cases where customer data cannot be fetched
            return False, "", f"Could not retrieve customer details for PAN {pan}. Error: {e}"

validation_service = ValidationService()
