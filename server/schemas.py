from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# ---------------- USER SCHEMAS ----------------
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "user"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserOut] = None


class TokenData(BaseModel):
    email: Optional[str] = None


# ---------------- CATEGORY SCHEMAS ----------------
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., pattern="^(Income|Expense)$")


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[str] = Field(None, pattern="^(Income|Expense)$")


class CategoryOut(CategoryBase):
    id: str
    user_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------- TRANSACTION SCHEMAS ----------------
class TransactionBase(BaseModel):
    amount: float = Field(
        ..., gt=0, description="Amount must be positive numeric value"
    )
    date: date
    transaction_type: str = Field(..., pattern="^(Income|Expense)$")
    category_id: Optional[str] = None
    payment_method: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None
    receipt_url: Optional[str] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None
    transaction_type: Optional[str] = Field(None, pattern="^(Income|Expense)$")
    category_id: Optional[str] = None
    payment_method: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    receipt_url: Optional[str] = None


class TransactionOut(TransactionBase):
    id: str
    user_id: str
    category: Optional[CategoryOut] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TransactionListResponse(BaseModel):
    items: List[TransactionOut]
    total: int
    skip: int
    limit: int


# ---------------- BUDGET SCHEMAS ----------------
class BudgetCreate(BaseModel):
    category_id: str
    monthly_limit: float = Field(
        ..., gt=0, description="Monthly budget limit must be positive"
    )
    month: str = Field(
        ..., pattern=r"^\d{4}-(0[1-9]|1[0-2])$", description="Format: YYYY-MM"
    )


class BudgetUpdate(BaseModel):
    monthly_limit: Optional[float] = Field(None, gt=0)


class BudgetOut(BaseModel):
    id: str
    user_id: str
    category_id: str
    monthly_limit: float
    month: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BudgetStatusOut(BaseModel):
    id: Optional[str] = None
    category_id: str
    category_name: str
    monthly_limit: float
    month: str
    spent: float
    percentage: float
    alert_level: str  # "NORMAL" | "WARNING" | "BREACHED"


# ---------------- ANALYTICS & REPORTS SCHEMAS ----------------
class CategoryBreakdownItem(BaseModel):
    category_name: str
    amount: float
    percentage: float


class AnalyticsSummary(BaseModel):
    total_income: float
    total_expense: float
    net_balance: float
    category_breakdown: List[CategoryBreakdownItem]
