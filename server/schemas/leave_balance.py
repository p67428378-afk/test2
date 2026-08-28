from typing import List
from pydantic import BaseModel, ConfigDict


class BalanceItem(BaseModel):
    leave_type: str
    allocated_days: int
    used_days: int
    remaining_days: int

    model_config = ConfigDict(from_attributes=True)


class UserBalanceResponse(BaseModel):
    user_id: str
    year: int
    balances: List[BalanceItem]
