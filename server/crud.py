import random
import string
from sqlalchemy.orm import Session, joinedload
from server import models, schemas, auth
from server.notification import send_milestone_notification


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user_in: schemas.UserRegister):
    hashed_password = auth.get_password_hash(user_in.password)
    db_user = models.User(
        email=user_in.email,
        password_hash=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role or "customer",
    )
    db.add(db_user)
    return db_user


def generate_tracking_id() -> str:
    chars = string.ascii_uppercase + string.digits
    random_str = "".join(random.choices(chars, k=10))
    return f"TRK-{random_str}"


def create_shipment(db: Session, shipment_in: schemas.ShipmentCreate, user_id: str):
    tracking_id = generate_tracking_id()
    # Ensure uniqueness
    while (
        db.query(models.Shipment)
        .filter(models.Shipment.tracking_id == tracking_id)
        .first()
    ):
        tracking_id = generate_tracking_id()

    db_shipment = models.Shipment(
        tracking_id=tracking_id,
        user_id=user_id,
        sender_details=shipment_in.sender_details.model_dump(),
        recipient_details=shipment_in.recipient_details.model_dump(),
        package_details=shipment_in.package_details.model_dump(),
        status="booked",
    )
    db.add(db_shipment)
    db.flush()  # Get shipment ID

    # Create initial tracking history
    db_history = models.TrackingHistory(
        shipment_id=db_shipment.id,
        status="booked",
        location=shipment_in.sender_details.city,
        notes="Shipment booked successfully.",
    )
    db.add(db_history)

    # Send notification
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user:
            send_milestone_notification(
                recipient_email=user.email,
                tracking_id=db_shipment.tracking_id,
                milestone="booked",
                details="Your shipment has been successfully booked.",
            )
    except Exception as e:
        print(f"Failed to send notification: {e}")

    return db_shipment


def get_user_shipments(db: Session, user_id: str, skip: int = 0, limit: int = 20):
    return (
        db.query(models.Shipment)
        .filter(models.Shipment.user_id == user_id)
        .order_by(models.Shipment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_shipment_by_tracking_id(db: Session, tracking_id: str):
    return (
        db.query(models.Shipment)
        .options(joinedload(models.Shipment.tracking_history))
        .filter(models.Shipment.tracking_id == tracking_id)
        .first()
    )


def create_delivery_agent(db: Session, agent_in: schemas.AgentCreate):
    db_agent = models.DeliveryAgent(
        full_name=agent_in.full_name,
        phone_number=agent_in.phone_number,
        status="active",
    )
    db.add(db_agent)
    return db_agent


def get_delivery_agents(db: Session):
    agents = (
        db.query(models.DeliveryAgent)
        .order_by(models.DeliveryAgent.created_at.desc())
        .all()
    )
    result = []
    for agent in agents:
        # Count active shipments (status not in ['delivered', 'cancelled'])
        active_count = (
            db.query(models.Shipment)
            .filter(models.Shipment.agent_id == agent.id)
            .filter(models.Shipment.status.notin_(["delivered", "cancelled"]))
            .count()
        )
        result.append(
            {
                "id": agent.id,
                "full_name": agent.full_name,
                "phone_number": agent.phone_number,
                "status": agent.status,
                "active_shipments_count": active_count,
            }
        )
    return result


def assign_agent_to_shipment(db: Session, shipment_id: str, agent_id: str):
    shipment = (
        db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    )
    if not shipment:
        return None

    agent = (
        db.query(models.DeliveryAgent)
        .filter(models.DeliveryAgent.id == agent_id)
        .first()
    )
    if not agent:
        return None

    shipment.agent_id = agent_id
    shipment.status = "assigned"

    # Add tracking history entry
    history = models.TrackingHistory(
        shipment_id=shipment.id,
        status="assigned",
        location=shipment.sender_details.get("city", "Unknown"),
        notes=f"Assigned to delivery agent: {agent.full_name}",
    )
    db.add(history)

    # Send notification
    try:
        user = db.query(models.User).filter(models.User.id == shipment.user_id).first()
        if user:
            send_milestone_notification(
                recipient_email=user.email,
                tracking_id=shipment.tracking_id,
                milestone="assigned",
                details=f"Your shipment has been assigned to delivery agent: {agent.full_name}.",
            )
    except Exception as e:
        print(f"Failed to send notification: {e}")

    return shipment


def update_shipment_status(
    db: Session, shipment_id: str, status: str, location: str, notes: str = None
):
    shipment = (
        db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    )
    if not shipment:
        return None

    shipment.status = status

    # Add tracking history entry
    history = models.TrackingHistory(
        shipment_id=shipment.id, status=status, location=location, notes=notes
    )
    db.add(history)

    # Send notification
    try:
        user = db.query(models.User).filter(models.User.id == shipment.user_id).first()
        if user:
            send_milestone_notification(
                recipient_email=user.email,
                tracking_id=shipment.tracking_id,
                milestone=status,
                details=f"Your shipment status has been updated to: {status}. Location: {location}. Notes: {notes or ''}",
            )
    except Exception as e:
        print(f"Failed to send notification: {e}")

    return shipment
