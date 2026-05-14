
from sqlalchemy.orm import Session
from server import crud, schemas
from uuid import UUID
import time

# Mock BBPS and Core Banking Services
class BbpsIntegrationService:
    def validate_operator(self, account_number: str, operator_id: str, service_type: str) -> bool:
        # In a real app, this would call the BBPS API
        print(f"Validating operator {operator_id} for {account_number}")
        return True

    def process_recharge(self, request_id: UUID, account_number: str, amount: float, operator_id: str) -> tuple[bool, str]:
        # In a real app, this would call the BBPS API
        print(f"Processing recharge for {account_number} with amount {amount}")
        time.sleep(2) # Simulate network delay
        # Simulate success or failure
        if amount > 1000:
            return False, "RECHARGE_FAILED_OPERATOR"
        return True, "OPCONF987654321"

class CoreBankingIntegrationService:
    def debit_account(self, user_id: str, amount: float) -> tuple[bool, str]:
        # In a real app, this would call the core banking API
        print(f"Debiting {amount} from account of user {user_id}")
        # Simulate success or failure
        if amount > 5000:
            return False, "INSUFFICIENT_FUNDS"
        return True, "BANK123456789"

    def reverse_debit(self, bank_transaction_id: str):
        # In a real app, this would call the core banking API
        print(f"Reversing debit for transaction {bank_transaction_id}")
        return True

# Service layer functions

bbps_service = BbpsIntegrationService()
core_banking_service = CoreBankingIntegrationService()

def get_operators(account_number: str, service_type: str) -> schemas.OperatorResponse:
    # In a real app, this would fetch operators from a database or BBPS
    if service_type == "mobile":
        operators = [
            schemas.Operator(name="Vodafone Idea", operator_id="VODAFONE"),
            schemas.Operator(name="Airtel", operator_id="AIRTEL"),
            schemas.Operator(name="Jio", operator_id="JIO"),
        ]
    elif service_type == "dth":
        operators = [
            schemas.Operator(name="Tata Sky", operator_id="TATASKY"),
            schemas.Operator(name="Dish TV", operator_id="DISHTV"),
        ]
    else:
        operators = []
    return schemas.OperatorResponse(operators=operators)

def initiate_recharge(db: Session, request: schemas.InitiateRechargeRequest) -> schemas.InitiateRechargeResponse:
    # 1. Validate operator
    if not bbps_service.validate_operator(request.account_number, request.operator_id, request.service_type):
        raise ValueError("Invalid operator for the given account number.")

    # 2. Create recharge request in INITIATED state
    db_recharge_request = crud.create_recharge_request(db, request)

    # 3. Log event
    crud.create_transaction_log(db, db_recharge_request.request_id, "INITIATED", request.dict())

    return schemas.InitiateRechargeResponse(request_id=db_recharge_request.request_id)

def confirm_recharge(db: Session, request: schemas.ConfirmRechargeRequest) -> schemas.ConfirmRechargeResponse:
    # 1. Get recharge request
    recharge_request = crud.get_recharge_request(db, request.request_id)
    if not recharge_request:
        raise ValueError("Invalid request ID")

    if not request.user_confirmation:
        crud.update_recharge_request_status(db, request.request_id, "CANCELLED")
        crud.create_transaction_log(db, request.request_id, "USER_CANCELLED", {})
        return schemas.ConfirmRechargeResponse(message="Recharge cancelled by user.", status="CANCELLED", transaction_id=request.request_id)

    # 2. Debit account
    debit_success, bank_txn_id = core_banking_service.debit_account(recharge_request.user_id, recharge_request.amount)
    if not debit_success:
        crud.update_recharge_request_status(db, request.request_id, "DEBIT_FAILED")
        crud.create_transaction_log(db, request.request_id, "DEBIT_FAILED", {"reason": bank_txn_id})
        raise ConnectionError(f"Debit Failed: {bank_txn_id}")
    
    crud.update_recharge_request_status(db, request.request_id, "DEBIT_SUCCESS", bank_transaction_id=bank_txn_id)
    crud.create_transaction_log(db, request.request_id, "DEBIT_SUCCESS", {"bank_transaction_id": bank_txn_id})

    # 3. Process recharge via BBPS
    recharge_success, operator_ref = bbps_service.process_recharge(recharge_request.request_id, recharge_request.account_number, recharge_request.amount, recharge_request.operator)
    
    if not recharge_success:
        crud.update_recharge_request_status(db, request.request_id, "RECHARGE_FAILED")
        crud.create_transaction_log(db, request.request_id, "RECHARGE_FAILED", {"reason": operator_ref})
        # 4. Initiate reversal
        core_banking_service.reverse_debit(bank_txn_id)
        crud.update_recharge_request_status(db, request.request_id, "REVERSAL_INITIATED")
        crud.create_transaction_log(db, request.request_id, "REVERSAL_INITIATED", {})
        raise ConnectionAbortedError("Recharge failed. Amount will be reversed.")

    # 5. Update status to RECHARGED
    crud.update_recharge_request_status(db, request.request_id, "RECHARGED", operator_reference=operator_ref)
    crud.create_transaction_log(db, request.request_id, "RECHARGED", {"operator_reference": operator_ref})

    return schemas.ConfirmRechargeResponse(message="Recharge successful!", status="RECHARGED", transaction_id=request.request_id)

def get_recharge_status(db: Session, transaction_id: UUID) -> schemas.RechargeStatusResponse:
    recharge_request = crud.get_recharge_request(db, transaction_id)
    if not recharge_request:
        raise ValueError("Invalid transaction ID")

    response = schemas.RechargeStatusResponse(
        status=recharge_request.status,
        transaction_id=recharge_request.request_id,
        bank_transaction_id=recharge_request.bank_transaction_id,
        operator_reference=recharge_request.operator_reference
    )

    if "FAILED" in recharge_request.status:
        response.error_message = f"Recharge status: {recharge_request.status}"
        if recharge_request.status == "REVERSAL_INITIATED":
            response.reversal_status = "Reversal is being processed."
        else:
            response.reversal_status = "Reversal successful."

    return response
