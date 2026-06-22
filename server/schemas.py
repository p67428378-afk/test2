from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class GreetingBase(BaseModel):
    greeting: str
    region: str
    description: str


class GreetingCreate(GreetingBase):
    pass


class Greeting(GreetingBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
