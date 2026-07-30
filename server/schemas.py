from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID


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


# Zoo Visitor App Schemas


class AnimalResponse(BaseModel):
    id: UUID
    name: str
    species: str
    status: str
    enclosure_id: UUID
    habitat: Optional[str] = None
    diet: Optional[str] = None
    conservation_status: Optional[str] = None
    image_url: Optional[str] = None
    qr_code: Optional[str] = None

    class Config:
        from_attributes = True


class EnclosureResponse(BaseModel):
    id: UUID
    name: str
    location_x: float
    location_y: float
    description: Optional[str] = None

    class Config:
        from_attributes = True


class MapEnclosureResponse(BaseModel):
    id: UUID
    name: str
    location_x: float
    location_y: float

    class Config:
        from_attributes = True


class FacilityResponse(BaseModel):
    id: UUID
    name: str
    type: str
    location_x: float
    location_y: float

    class Config:
        from_attributes = True


class PathResponse(BaseModel):
    id: UUID
    points: List[List[float]]

    class Config:
        from_attributes = True


class MapDataResponse(BaseModel):
    enclosures: List[MapEnclosureResponse]
    facilities: List[FacilityResponse]
    paths: List[PathResponse]
