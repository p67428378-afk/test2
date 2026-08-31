from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


# Member Schemas
class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Member name")
    email: Optional[str] = Field(
        None, max_length=255, description="Optional email address"
    )


class MemberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    group_id: str
    name: str
    email: Optional[str] = None
    created_at: datetime


# Group Schemas
class GroupCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Group name")
    description: Optional[str] = Field(None, description="Optional group description")
    members: List[MemberCreate] = Field(
        ..., min_length=1, description="List of group members"
    )


class GroupResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    members: List[MemberResponse] = []


class GroupSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    member_count: int = 0
    total_spent: float = 0.0
    members: List[MemberResponse] = []


# Split Schemas
class ExpenseSplitInput(BaseModel):
    member_id: str = Field(..., description="ID of the participating member")
    split_value: Optional[float] = Field(
        None,
        description="Value for split (percentage e.g. 50.0, fixed amount e.g. 40.0, or optional for equal)",
    )


class ExpenseSplitResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    expense_id: Optional[str] = None
    member_id: str
    member_name: Optional[str] = None
    split_value: float
    computed_amount: float


# Expense Schemas
class ExpenseCreate(BaseModel):
    group_id: str = Field(..., description="Target group ID")
    title: str = Field(..., min_length=1, max_length=255, description="Expense title")
    total_amount: float = Field(
        ..., gt=0, description="Total expense amount (must be > 0)"
    )
    payer_id: str = Field(..., description="Member ID of payer")
    category: Optional[str] = Field(
        "General", max_length=100, description="Expense category"
    )
    split_type: str = Field("EQUAL", description="Split type: EQUAL, PERCENTAGE, FIXED")
    expense_date: Optional[datetime] = Field(None, description="Date of expense")
    splits: List[ExpenseSplitInput] = Field(
        ..., min_length=1, description="List of participant splits"
    )


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    group_id: str
    title: str
    total_amount: float
    payer_id: str
    payer_name: Optional[str] = None
    category: str
    split_type: str
    expense_date: datetime
    created_at: datetime
    updated_at: datetime
    splits: List[ExpenseSplitResponse] = []


# Settlement Schemas
class MemberBalance(BaseModel):
    member_id: str
    member_name: str
    net_balance: float


class SettlementTransfer(BaseModel):
    from_member: str
    to_member: str
    amount: float
    from_member_id: Optional[str] = None
    to_member_id: Optional[str] = None


class SettlementResponse(BaseModel):
    group_id: str
    balances: List[MemberBalance]
    settlements: List[SettlementTransfer]
