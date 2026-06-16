import uuid
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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


# Recipe Schemas
class IngredientSchema(BaseModel):
    id: uuid.UUID
    name: str
    quantity: str

    class Config:
        from_attributes = True
        orm_mode = True

class InstructionSchema(BaseModel):
    id: uuid.UUID
    step_number: int
    description: str

    class Config:
        from_attributes = True
        orm_mode = True

class RecipeListSchema(BaseModel):
    id: uuid.UUID
    name: str
    description: str
    image_url: Optional[str] = None
    difficulty: str
    prep_time: str
    cook_time: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

class RecipeDetailSchema(RecipeListSchema):
    ingredients: List[IngredientSchema]
    instructions: List[InstructionSchema]

    class Config:
        from_attributes = True
        orm_mode = True
