from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID, uuid4
from datetime import datetime, timedelta

# Existing Password Reset CRUD
def get_user_by_login_id(db: Session, login_id: str):
    return db.query(models.User).filter(models.User.login_id == login_id).first()

def get_user_by_mobile_number(db: Session, mobile_number: str):
    return db.query(models.User).filter(models.User.mobile_number == mobile_number).first()

def create_otp(db: Session, user_id: str, otp_code_hash: str, expires_at: str):
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


# New Gas Pipeline Management CRUD

def get_pipelines(db: Session):
    return db.query(models.Pipeline).all()

def get_pipeline(db: Session, pipeline_id: UUID):
    return db.query(models.Pipeline).filter(models.Pipeline.id == pipeline_id).first()

def get_sensors_by_pipeline(db: Session, pipeline_id: UUID):
    return db.query(models.Sensor).filter(models.Sensor.pipeline_id == pipeline_id).all()

def get_alerts(db: Session):
    return db.query(models.Alert).all()

def get_alert(db: Session, alert_id: UUID):
    return db.query(models.Alert).filter(models.Alert.id == alert_id).first()

def acknowledge_alert(db: Session, alert_id: UUID):
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if db_alert:
        db_alert.status = "acknowledged"
        db.commit()
        db.refresh(db_alert)
    return db_alert

def get_maintenance_orders(db: Session):
    return db.query(models.MaintenanceOrder).all()

def get_maintenance_order(db: Session, order_id: UUID):
    return db.query(models.MaintenanceOrder).filter(models.MaintenanceOrder.id == order_id).first()

def create_maintenance_order(db: Session, order: schemas.MaintenanceCreateRequest):
    db_order = models.MaintenanceOrder(
        pipeline_id=order.pipeline_id,
        description=order.description,
        assigned_to=order.assigned_to,
        priority=order.priority,
        due_date=order.due_date,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_maintenance_order(db: Session, order_id: UUID, update_data: schemas.MaintenanceUpdateRequest):
    db_order = db.query(models.MaintenanceOrder).filter(models.MaintenanceOrder.id == order_id).first()
    if db_order:
        if update_data.assigned_to is not None:
            db_order.assigned_to = update_data.assigned_to
        if update_data.priority is not None:
            db_order.priority = update_data.priority
        if update_data.status is not None:
            db_order.status = update_data.status
        db.commit()
        db.refresh(db_order)
    return db_order


def seed_db(db: Session):
    # Check if already seeded
    if db.query(models.Pipeline).first() is not None:
        return

    # Create Pipelines
    p1 = models.Pipeline(id=uuid4(), name="Sector 4B", location="Gulf Sector Alpha", status="critical")
    p2 = models.Pipeline(id=uuid4(), name="Sector 2A", location="Gulf Sector Beta", status="warning")
    p3 = models.Pipeline(id=uuid4(), name="Sector 1C", location="Gulf Sector Gamma", status="normal")
    db.add_all([p1, p2, p3])
    db.commit()

    # Create Sensors
    s1 = models.Sensor(id=uuid4(), pipeline_id=p1.id, type="Pressure", location="Sector 4B", current_reading=24.1, status="critical")
    s2 = models.Sensor(id=uuid4(), pipeline_id=p2.id, type="Pressure", location="Sector 2A", current_reading=19.2, status="warning")
    s3 = models.Sensor(id=uuid4(), pipeline_id=p3.id, type="Pressure", location="Sector 1C", current_reading=15.1, status="normal")
    s4 = models.Sensor(id=uuid4(), pipeline_id=p3.id, type="Pressure", location="Sector 1C", current_reading=None, status="no_data")
    db.add_all([s1, s2, s3, s4])
    db.commit()

    # Create 24h readings for s1, s2, s3
    now = datetime.utcnow()
    for i in range(24):
        t = now - timedelta(hours=24-i)
        # s1 readings rising to critical
        db.add(models.PressureReading(sensor_id=s1.id, timestamp=t, value=15.0 + (i * 0.4)))
        # s2 readings stable warning
        db.add(models.PressureReading(sensor_id=s2.id, timestamp=t, value=18.0 + (i % 2) * 0.5))
        # s3 readings normal
        db.add(models.PressureReading(sensor_id=s3.id, timestamp=t, value=14.8 + (i % 3) * 0.1))
    db.commit()

    # Create Alerts
    a1 = models.Alert(id=uuid4(), sensor_id=s1.id, pipeline_id=p1.id, severity="critical", status="active", location="Sector 4B", timestamp=now)
    a2 = models.Alert(id=uuid4(), sensor_id=s2.id, pipeline_id=p2.id, severity="moderate", status="acknowledged", location="Sector 2A", timestamp=now - timedelta(hours=2))
    db.add_all([a1, a2])
    db.commit()

    # Create Maintenance Orders
    m1 = models.MaintenanceOrder(
        id=uuid4(),
        pipeline_id=p1.id,
        description="Repair critical leak in Sector 4B",
        assigned_to="Crew Alpha",
        priority="high",
        due_date=now + timedelta(days=1),
        status="in_progress"
    )
    m2 = models.MaintenanceOrder(
        id=uuid4(),
        pipeline_id=p2.id,
        description="Routine inspection of Sector 2A",
        assigned_to="Crew Beta",
        priority="medium",
        due_date=now + timedelta(days=5),
        status="pending"
    )
    db.add_all([m1, m2])
    db.commit()
