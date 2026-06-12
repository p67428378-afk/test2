from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

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


# Flower Schemas
class FlowerBase(BaseModel):
    flower_type: str

class FlowerCreate(FlowerBase):
    pass

class FlowerResponse(FlowerBase):
    flower_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Inventory Schemas
class InventoryBase(BaseModel):
    flower_id: str
    quantity: int
    harvest_date: datetime
    status: str
    shelf_life: int

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    quantity: int
    status: str

class InventoryResponse(InventoryBase):
    inventory_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InventoryGetResponse(BaseModel):
    inventory_id: str
    flower_id: str
    flower_type: str
    quantity: int
    harvest_date: datetime
    status: str
    shelf_life: int
    approaching_expiration: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Sensor Data Schemas
class SensorDataBase(BaseModel):
    batch_id: str
    humidity: float
    light_intensity: float
    soil_moisture: float
    temperature: float

class SensorDataCreate(SensorDataBase):
    pass

class SensorDataResponse(SensorDataBase):
    data_id: str
    timestamp: datetime

    class Config:
        from_attributes = True

class LatestSensorData(BaseModel):
    humidity: float
    light_intensity: float
    soil_moisture: float
    temperature: float
    timestamp: datetime

    class Config:
        from_attributes = True


# Plant Batch Schemas
class PlantBatchBase(BaseModel):
    flower_id: str
    growth_stage: str

class PlantBatchCreate(PlantBatchBase):
    pass

class PlantBatchUpdate(BaseModel):
    growth_stage: str

class PlantBatchCreateResponse(PlantBatchBase):
    batch_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PlantBatchResponse(BaseModel):
    batch_id: str
    flower_id: str
    flower_type: str
    growth_stage: str
    latest_sensor_data: Optional[LatestSensorData] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Task Schemas
class TaskBase(BaseModel):
    user_id: str
    task_type: str
    description: Optional[str] = None
    scheduled_date: date
    status: str
    time_spent: Optional[int] = 0

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    status: str
    time_spent: Optional[int] = 0

class TaskResponse(TaskBase):
    task_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
