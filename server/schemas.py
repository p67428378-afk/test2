from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


# ---------------- Group Member Schemas ----------------

class GroupMemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: Optional[str] = Field(None, max_length=255)


class GroupMemberCreate(GroupMemberBase):
    pass


class GroupMemberResponse(GroupMemberBase):
    id: str
    group_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- Group Schemas ----------------

class GroupBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class GroupCreate(GroupBase):
    pass


class GroupResponse(GroupBase):
    id: str
    created_at: datetime
    updated_at: datetime
    members: List[GroupMemberResponse] = []

    model_config = ConfigDict(from_attributes=True)


# ---------------- Expense Split Schemas ----------------

class ExpenseSplitInput(BaseModel):
    member_id: str
    share_amount: Optional[float] = None
    percentage: Optional[float] = None


class ExpenseSplitResponse(BaseModel):
    id: str
    expense_id: str
    member_id: str
    share_amount: float
    percentage: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- Expense Schemas ----------------

class ExpenseCreate(BaseModel):
    group_id: str
    title: str = Field(..., min_length=1, max_length=255)
    total_amount: float = Field(..., gt=0)
    payer_id: str
    split_type: str = Field(..., pattern="^(EQUAL|EXACT|PERCENTAGE)$")
    date: date
    category: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    splits: List[ExpenseSplitInput] = Field(..., min_length=1)


class ExpenseResponse(BaseModel):
    id: str
    group_id: str
    title: str
    total_amount: float
    payer_id: str
    split_type: str
    date: date
    category: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    splits: List[ExpenseSplitResponse] = []

    model_config = ConfigDict(from_attributes=True)


# ---------------- Settlement Schemas ----------------

class SettlementCreate(BaseModel):
    group_id: str
    payer_id: str
    payee_id: str
    amount: float = Field(..., gt=0)
    date: date
    notes: Optional[str] = None


class SettlementResponse(BaseModel):
    id: str
    group_id: str
    payer_id: str
    payee_id: str
    amount: float
    date: date
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- Balances & Debt Matrix Schemas ----------------

class NetBalanceResponse(BaseModel):
    member_id: str
    member_name: str
    net_balance: float

    model_config = ConfigDict(from_attributes=True)


class SimplifiedSettlementResponse(BaseModel):
    from_member_id: str
    from_member_name: str
    to_member_id: str
    to_member_name: str
    amount: float

    model_config = ConfigDict(from_attributes=True)


class GroupBalancesResponse(BaseModel):
    group_id: str
    net_balances: List[NetBalanceResponse]
    simplified_settlements: List[SimplifiedSettlementResponse]

    model_config = ConfigDict(from_attributes=True)
