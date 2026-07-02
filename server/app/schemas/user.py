from pydantic import BaseModel, EmailStr, Field, UUID4


class UserCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=255)
    last_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=255)


class UserResponse(BaseModel):
    id: UUID4
    first_name: str
    last_name: str
    email: str
    message: str

    class Config:
        from_attributes = True
