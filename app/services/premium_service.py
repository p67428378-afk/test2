from sqlalchemy.orm import Session
from app import models, schemas
from decimal import Decimal

def calculate_premium_logic(
    base_rate: Decimal,
    ncb_percentage: Decimal,
    vehicle_multiplier: Decimal
) -> Decimal:
    # Apply NCB cap
    actual_ncb_percentage = min(ncb_percentage, Decimal('0.50'))
    premium = base_rate * (Decimal('1.0') - actual_ncb_percentage) * vehicle_multiplier
    return premium.quantize(Decimal('0.01')) # Round to two decimal places

def get_or_create_customer(db: Session, customer_data: schemas.CustomerCreate) -> models.Customer:
    customer = db.query(models.Customer).filter(models.Customer.email == customer_data.email).first()
    if not customer:
        customer = models.Customer(**customer_data.model_dump())
        db.add(customer)
        db.commit()
        db.refresh(customer)
    return customer

def get_or_create_vehicle(db: Session, vehicle_data: schemas.VehicleCreate) -> models.Vehicle:
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.vin == vehicle_data.vin).first()
    if not vehicle:
        vehicle = models.Vehicle(**vehicle_data.model_dump())
        db.add(vehicle)
        db.commit()
        db.refresh(vehicle)
    return vehicle

def create_policy(
    db: Session,
    policy_data: schemas.PolicyCreate,
    calculated_premium: Decimal
) -> models.Policy:
    db_policy = models.Policy(
        **policy_data.model_dump(exclude={'customer_id', 'vehicle_id'}),
        customer_id=policy_data.customer_id,
        vehicle_id=policy_data.vehicle_id,
        calculated_premium=calculated_premium
    )
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy
