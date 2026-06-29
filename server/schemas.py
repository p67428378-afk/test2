"""
Module: schemas
Purpose: Pydantic schemas for request/response validation and serialization.
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID


# Existing Password Reset Schemas
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


# Auth Schemas
class UserRegisterRequest(BaseModel):
    login_id: str
    mobile_number: str
    password: str
    security_question: str
    security_answer: str


class UserRegisterResponse(BaseModel):
    id: UUID
    login_id: str
    mobile_number: str

    class Config:
        from_attributes = True


class UserLoginRequest(BaseModel):
    login_id: str
    password: str


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str


class UserMeResponse(BaseModel):
    id: UUID
    login_id: str
    mobile_number: str

    class Config:
        from_attributes = True


# Item & Auction Schemas
class AuctionInItem(BaseModel):
    id: UUID
    current_highest_bid: Optional[float] = None
    end_time: datetime
    start_time: datetime
    starting_price: float
    status: str

    class Config:
        from_attributes = True


class ItemResponse(BaseModel):
    id: UUID
    name: str
    description: str
    images: List[str] = []
    seller_id: UUID
    auction: Optional[AuctionInItem] = None

    class Config:
        from_attributes = True


class ItemListResponse(BaseModel):
    items: List[ItemResponse]
    total: int


# Item Detail Schemas
class BidInAuction(BaseModel):
    id: UUID
    amount: float
    created_at: datetime
    user_id: UUID
    user_name: str

    class Config:
        from_attributes = True


class AuctionDetail(BaseModel):
    id: UUID
    current_highest_bid: Optional[float] = None
    end_time: datetime
    start_time: datetime
    starting_price: float
    status: str
    bids: List[BidInAuction] = []
    winner_id: Optional[UUID] = None
    winner_name: Optional[str] = None
    winner_instructions: Optional[str] = None

    class Config:
        from_attributes = True


class ItemDetailResponse(BaseModel):
    id: UUID
    name: str
    description: str
    images: List[str] = []
    seller_id: UUID
    seller_name: str
    auction: Optional[AuctionDetail] = None

    class Config:
        from_attributes = True


# Bid Schemas
class PlaceBidRequest(BaseModel):
    amount: float


class PlaceBidResponse(BaseModel):
    id: UUID
    amount: float
    auction_id: UUID
    created_at: datetime
    user_id: UUID

    class Config:
        from_attributes = True
