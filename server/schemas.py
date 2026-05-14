
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class Operator(BaseModel):
    name: str
    operator_id: str

class OperatorResponse(BaseModel):
    operators: List[Operator]

class InitiateRechargeRequest(BaseModel):
    account_number: str
    amount: float
    operator_id: str
    service_type: str
    user_id: str

class InitiateRechargeResponse(BaseModel):
    request_id: UUID

class ConfirmRechargeRequest(BaseModel):
    request_id: UUID
    user_confirmation: bool

class ConfirmRechargeResponse(BaseModel):
    message: str
    status: str
    transaction_id: UUID

class RechargeStatusResponse(BaseModel):
    status: str
    transaction_id: UUID
    bank_transaction_id: Optional[str] = None
    operator_reference: Optional[str] = None
    error_message: Optional[str] = None
    reversal_status: Optional[str] = None

