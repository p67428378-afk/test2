
from pydantic import BaseModel, UUID4, EmailStr
from typing import List, Optional
from datetime import datetime, date

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class MatterBase(BaseModel):
    case_name: str
    client_id: UUID4
    description: Optional[str] = None
    status: str

class MatterCreate(MatterBase):
    pass

class Matter(MatterBase):
    id: UUID4
    start_date: datetime
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class DocumentBase(BaseModel):
    matter_id: UUID4
    file_name: str

class DocumentCreate(DocumentBase):
    file_path: str
    version: int = 1
    uploaded_by_user_id: UUID4

class Document(DocumentBase):
    id: UUID4
    version: int
    uploaded_by_user_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class TimeEntryBase(BaseModel):
    matter_id: UUID4
    user_id: UUID4
    hours: float
    description: Optional[str] = None
    date: date

class TimeEntryCreate(TimeEntryBase):
    pass

class TimeEntry(TimeEntryBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class InvoiceBase(BaseModel):
    client_id: UUID4
    matter_id: Optional[UUID4] = None
    total_amount: float
    status: str
    due_date: Optional[date] = None

class InvoiceCreate(InvoiceBase):
    pass

class Invoice(InvoiceBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
