from sqlalchemy.orm import Session
from server import models, schemas
from datetime import datetime, date

# Existing Password Reset CRUD
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: datetime):
    db_otp = models.OTP(user_id=user_id, otp_code_hash=otp_code_hash, expires_at=expires_at)
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp

def get_otp(db: Session, otp_session_id: str):
    return db.query(models.OTP).filter(models.OTP.id == otp_session_id).first()

def update_otp_as_used(db: Session, otp: models.OTP):
    otp.is_used = True
    db.commit()
    db.refresh(otp)
    return otp

def create_password_history(db: Session, user_id: str, hashed_password: str):
    db_password_history = models.PasswordHistory(user_id=user_id, hashed_password=hashed_password)
    db.add(db_password_history)
    db.commit()
    db.refresh(db_password_history)
    return db_password_history

def update_user_password(db: Session, user: models.User, hashed_password: str):
    user.hashed_password = hashed_password
    db.commit()
    db.refresh(user)
    return user


# Flower CRUD
def get_flower_by_id(db: Session, flower_id: str):
    return db.query(models.Flower).filter(models.Flower.flower_id == flower_id).first()

def get_flower_by_type(db: Session, flower_type: str):
    return db.query(models.Flower).filter(models.Flower.flower_type == flower_type).first()

def get_flowers(db: Session):
    return db.query(models.Flower).all()

def create_flower(db: Session, flower: schemas.FlowerCreate):
    db_flower = models.Flower(flower_type=flower.flower_type)
    db.add(db_flower)
    db.commit()
    db.refresh(db_flower)
    return db_flower


# Inventory CRUD
def get_inventory_item(db: Session, inventory_id: str):
    return db.query(models.Inventory).filter(models.Inventory.inventory_id == inventory_id).first()

def get_inventory(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(models.Inventory)
    if status:
        query = query.filter(models.Inventory.status == status)
    return query.offset(skip).limit(limit).all()

def create_inventory_item(db: Session, item: schemas.InventoryCreate):
    db_item = models.Inventory(
        flower_id=item.flower_id,
        quantity=item.quantity,
        harvest_date=item.harvest_date,
        status=item.status,
        shelf_life=item.shelf_life
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_inventory_item(db: Session, db_item: models.Inventory, item_update: schemas.InventoryUpdate):
    db_item.quantity = item_update.quantity
    db_item.status = item_update.status
    db_item.updated_at = datetime.now()
    db.commit()
    db.refresh(db_item)
    return db_item


# Plant Batch CRUD
def get_plant_batch(db: Session, batch_id: str):
    return db.query(models.PlantBatch).filter(models.PlantBatch.batch_id == batch_id).first()

def get_plant_batches(db: Session):
    return db.query(models.PlantBatch).all()

def create_plant_batch(db: Session, batch: schemas.PlantBatchCreate):
    db_batch = models.PlantBatch(
        flower_id=batch.flower_id,
        growth_stage=batch.growth_stage
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

def update_plant_batch(db: Session, db_batch: models.PlantBatch, batch_update: schemas.PlantBatchUpdate):
    db_batch.growth_stage = batch_update.growth_stage
    db_batch.updated_at = datetime.now()
    db.commit()
    db.refresh(db_batch)
    return db_batch


# Sensor Data CRUD
def create_sensor_data(db: Session, data: schemas.SensorDataCreate):
    db_data = models.SensorData(
        batch_id=data.batch_id,
        temperature=data.temperature,
        humidity=data.humidity,
        soil_moisture=data.soil_moisture,
        light_intensity=data.light_intensity
    )
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

def get_latest_sensor_data(db: Session, batch_id: str):
    return db.query(models.SensorData).filter(models.SensorData.batch_id == batch_id).order_by(models.SensorData.timestamp.desc()).first()


# Task CRUD
def get_task(db: Session, task_id: str):
    return db.query(models.Task).filter(models.Task.task_id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100, status: str = None):
    query = db.query(models.Task)
    if status:
        query = query.filter(models.Task.status == status)
    return query.offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(
        user_id=task.user_id,
        task_type=task.task_type,
        description=task.description,
        scheduled_date=task.scheduled_date,
        status=task.status,
        time_spent=task.time_spent
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, db_task: models.Task, task_update: schemas.TaskUpdate):
    db_task.status = task_update.status
    db_task.time_spent = task_update.time_spent
    db_task.updated_at = datetime.now()
    db.commit()
    db.refresh(db_task)
    return db_task
