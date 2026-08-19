from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str = "Technician"
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class UserSummary(BaseModel):
    id: str
    full_name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)
