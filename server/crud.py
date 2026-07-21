from sqlalchemy.orm import Session
from server import models, schemas
from uuid import UUID
from datetime import datetime
from typing import List, Optional


# Schedules CRUD
def create_schedule(db: Session, schedule: schemas.ScheduleCreate) -> models.Schedule:
    db_schedule = models.Schedule(
        vessel_name=schedule.vessel_name,
        route=schedule.route,
        start_date=schedule.start_date,
        end_date=schedule.end_date,
        destination_port=schedule.destination_port,
        status=schedule.status,
        notes=schedule.notes,
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


def get_schedules(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> List[models.Schedule]:
    query = db.query(models.Schedule)
    if start_date:
        query = query.filter(models.Schedule.start_date >= start_date)
    if end_date:
        query = query.filter(models.Schedule.end_date <= end_date)
    if status:
        query = query.filter(models.Schedule.status == status)
    return query.offset(skip).limit(limit).all()


def get_schedule(db: Session, schedule_id: UUID) -> Optional[models.Schedule]:
    return db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()


def update_schedule(
    db: Session, db_schedule: models.Schedule, schedule: schemas.ScheduleUpdate
) -> models.Schedule:
    update_data = schedule.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_schedule, key, value)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


# Expeditions CRUD
def create_expedition(
    db: Session, expedition: schemas.ExpeditionCreate
) -> models.Expedition:
    db_expedition = models.Expedition(
        name=expedition.name,
        schedule_id=expedition.schedule_id,
        start_date=expedition.start_date,
        end_date=expedition.end_date,
        research_goals=expedition.research_goals,
    )
    db.add(db_expedition)
    db.commit()
    db.refresh(db_expedition)
    return db_expedition


def get_expeditions(
    db: Session, schedule_id: Optional[UUID] = None, skip: int = 0, limit: int = 20
) -> List[models.Expedition]:
    query = db.query(models.Expedition)
    if schedule_id:
        query = query.filter(models.Expedition.schedule_id == schedule_id)
    return query.offset(skip).limit(limit).all()


def get_expedition(db: Session, expedition_id: UUID) -> Optional[models.Expedition]:
    return (
        db.query(models.Expedition)
        .filter(models.Expedition.id == expedition_id)
        .first()
    )


# Equipment CRUD
def get_equipment_list(
    db: Session, status: Optional[str] = None, skip: int = 0, limit: int = 20
) -> List[models.Equipment]:
    query = db.query(models.Equipment)
    if status:
        query = query.filter(models.Equipment.status == status)
    return query.offset(skip).limit(limit).all()


def get_equipment(db: Session, equipment_id: UUID) -> Optional[models.Equipment]:
    return (
        db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    )


def update_equipment(
    db: Session, db_equipment: models.Equipment, equipment: schemas.EquipmentUpdate
) -> models.Equipment:
    update_data = equipment.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_equipment, key, value)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment


# Fuel Logs CRUD
def create_fuel_log(db: Session, log: schemas.FuelLogCreate) -> models.FuelLog:
    db_log = models.FuelLog(
        vessel_id=log.vessel_id,
        fuel_consumed=log.fuel_consumed,
        distance_traveled=log.distance_traveled,
        timestamp=log.timestamp or datetime.now(),
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


def get_fuel_logs(
    db: Session,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> List[models.FuelLog]:
    query = db.query(models.FuelLog)
    if start_date:
        query = query.filter(models.FuelLog.timestamp >= start_date)
    if end_date:
        query = query.filter(models.FuelLog.timestamp <= end_date)
    return query.all()


# Crew CRUD
def get_crew_member(db: Session, crew_id: UUID) -> Optional[models.Crew]:
    return db.query(models.Crew).filter(models.Crew.id == crew_id).first()


def assign_crew_to_expedition(
    db: Session, expedition_id: UUID, crew_id: UUID, role: str
) -> models.ExpeditionCrew:
    db_assignment = models.ExpeditionCrew(
        expedition_id=expedition_id, crew_id=crew_id, role=role
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


def get_expedition_crew(
    db: Session, expedition_id: UUID
) -> List[models.ExpeditionCrew]:
    return (
        db.query(models.ExpeditionCrew)
        .filter(models.ExpeditionCrew.expedition_id == expedition_id)
        .all()
    )


# Samples CRUD
def create_sample(db: Session, sample: schemas.SampleCreate) -> models.Sample:
    db_sample = models.Sample(
        expedition_id=sample.expedition_id,
        sample_type=sample.sample_type,
        collection_date=sample.collection_date,
        storage_location=sample.storage_location,
        notes=sample.notes,
    )
    db.add(db_sample)
    db.commit()
    db.refresh(db_sample)
    return db_sample


def get_samples(
    db: Session, expedition_id: Optional[UUID] = None, skip: int = 0, limit: int = 20
) -> List[models.Sample]:
    query = db.query(models.Sample)
    if expedition_id:
        query = query.filter(models.Sample.expedition_id == expedition_id)
    return query.offset(skip).limit(limit).all()
