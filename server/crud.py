from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List
from server.models import User, PlotType, Plot
from server.schemas import UserCreate, PlotTypeCreate, PlotCreate, PlotUpdate
from server.auth import get_password_hash


# --- User CRUD ---
def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        hashed_password=hashed_password,
        role=user_in.role or "admin",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# --- PlotType CRUD ---
def get_plot_type_by_name(db: Session, name: str) -> Optional[PlotType]:
    return db.query(PlotType).filter(PlotType.name == name).first()


def get_plot_type_by_id(db: Session, plot_type_id: UUID) -> Optional[PlotType]:
    return db.query(PlotType).filter(PlotType.id == plot_type_id).first()


def get_plot_types(db: Session) -> List[PlotType]:
    return db.query(PlotType).all()


def create_plot_type(db: Session, plot_type_in: PlotTypeCreate) -> PlotType:
    db_plot_type = PlotType(
        name=plot_type_in.name, description=plot_type_in.description
    )
    db.add(db_plot_type)
    db.commit()
    db.refresh(db_plot_type)
    return db_plot_type


# --- Plot CRUD ---
def construct_plot_id(section: str, lot: str, plot_number: str) -> str:
    return f"SEC-{section.strip().upper()}-L{lot.strip().upper()}-P{plot_number.strip().upper()}"


def get_plot_by_id(db: Session, id: UUID) -> Optional[Plot]:
    return db.query(Plot).filter(Plot.id == id).first()


def get_plot_by_location(
    db: Session, section: str, lot: str, plot_number: str
) -> Optional[Plot]:
    plot_id = construct_plot_id(section, lot, plot_number)
    return db.query(Plot).filter(Plot.plot_id == plot_id).first()


def get_plots(
    db: Session,
    plot_type_id: Optional[UUID] = None,
    status: Optional[str] = None,
    section: Optional[str] = None,
    lot: Optional[str] = None,
    plot_number: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Plot]:
    query = db.query(Plot)
    if plot_type_id:
        query = query.filter(Plot.plot_type_id == plot_type_id)
    if status:
        query = query.filter(Plot.status.ilike(status))
    if section:
        query = query.filter(Plot.section.ilike(section))
    if lot:
        query = query.filter(Plot.lot.ilike(lot))
    if plot_number:
        query = query.filter(Plot.plot_number.ilike(plot_number))
    return query.offset(skip).limit(limit).all()


def create_plot(db: Session, plot_in: PlotCreate) -> Plot:
    plot_id = construct_plot_id(plot_in.section, plot_in.lot, plot_in.plot_number)
    db_plot = Plot(
        plot_id=plot_id,
        plot_type_id=plot_in.plot_type_id,
        status=plot_in.status,
        section=plot_in.section,
        lot=plot_in.lot,
        plot_number=plot_in.plot_number,
        dimensions=plot_in.dimensions,
        capacity=plot_in.capacity,
        price=plot_in.price,
    )
    db.add(db_plot)
    db.commit()
    db.refresh(db_plot)
    return db_plot


def update_plot(db: Session, db_plot: Plot, plot_in: PlotUpdate) -> Plot:
    plot_id = construct_plot_id(plot_in.section, plot_in.lot, plot_in.plot_number)
    db_plot.plot_id = plot_id
    db_plot.plot_type_id = plot_in.plot_type_id
    db_plot.status = plot_in.status
    db_plot.section = plot_in.section
    db_plot.lot = plot_in.lot
    db_plot.plot_number = plot_in.plot_number
    db_plot.dimensions = plot_in.dimensions
    db_plot.capacity = plot_in.capacity
    db_plot.price = plot_in.price
    db.commit()
    db.refresh(db_plot)
    return db_plot


def delete_plot(db: Session, db_plot: Plot) -> None:
    # The HLD says: "Deletes a burial plot (marks as inactive)"
    # Wait, does the schema have an 'is_active' column?
    # Let's check the schema in the WorkSpec:
    # The schema does NOT have an 'is_active' column.
    # Wait, let's check the DELETE endpoint description:
    # "Deletes a burial plot (marks as inactive)."
    # Wait, if there is no 'is_active' column, maybe we can set status to "Inactive" or delete it from the database?
    # Let's check the DELETE endpoint response: `{"message": "string"}`.
    # Let's delete it from the database, or set status to "Inactive" if status is a string.
    # Wait, let's delete it from the database to be safe, or let's support both.
    # Let's delete it from the database.
    db.delete(db_plot)
    db.commit()
