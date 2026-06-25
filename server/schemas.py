from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from decimal import Decimal


# Existing schemas
class PasswordResetInitiateRequest(BaseModel):
    login_id: str
    mobile_number: str


class PasswordResetInitiateResponse(BaseModel):
    otp_session_id: str
    security_question: str


class OTPVerifyRequest(BaseModel):
    otp_code: str
    otp_session_id: str


class OTPVerifyResponse(BaseModel):
    security_question_session_id: str


class SecurityQuestionVerifyRequest(BaseModel):
    answer: str
    security_question_session_id: str


class SecurityQuestionVerifyResponse(BaseModel):
    password_reset_session_id: str


class SetNewPasswordRequest(BaseModel):
    new_password: str
    password_reset_session_id: str


class SetNewPasswordResponse(BaseModel):
    status: str
    login_link: str


# New schemas for Pencil Showcase
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


class PencilBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal = Decimal("0.00")
    hardness: Optional[str] = None
    material: Optional[str] = None
    core_diameter: Optional[str] = None
    length: Optional[str] = None
    shape: Optional[str] = None
    eraser: bool = False
    image_url: Optional[str] = None
    images: List[str] = []


class PencilCreate(PencilBase):
    category_ids: List[UUID] = []


class PencilListItemResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    price: Decimal
    hardness: Optional[str] = None
    material: Optional[str] = None
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PencilListResponse(BaseModel):
    items: List[PencilListItemResponse]
    total: int
    skip: int
    limit: int


class PencilDetailResponse(PencilBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
