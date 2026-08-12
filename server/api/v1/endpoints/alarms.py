from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/alarms", response_model=List[schemas.AlarmResponse])
def read_alarms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alarms = crud.get_alarms(db, skip=skip, limit=limit)
    return alarms


@router.post(
    "/alarms",
    response_model=schemas.AlarmResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_alarm(alarm: schemas.AlarmCreate, db: Session = Depends(get_db)):
    return crud.create_alarm(db, alarm=alarm)


@router.get("/alarms/{alarm_id}", response_model=schemas.AlarmResponse)
def read_alarm(alarm_id: str, db: Session = Depends(get_db)):
    db_alarm = crud.get_alarm_by_id(db, alarm_id=alarm_id)
    if db_alarm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alarm not found"
        )
    return db_alarm


@router.put("/alarms/{alarm_id}", response_model=schemas.AlarmResponse)
def update_alarm(
    alarm_id: str,
    alarm_update: schemas.AlarmUpdate,
    db: Session = Depends(get_db),
):
    db_alarm = crud.get_alarm_by_id(db, alarm_id=alarm_id)
    if db_alarm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alarm not found"
        )
    return crud.update_alarm(db, db_alarm=db_alarm, alarm_update=alarm_update)


@router.delete("/alarms/{alarm_id}")
def delete_alarm(alarm_id: str, db: Session = Depends(get_db)):
    db_alarm = crud.get_alarm_by_id(db, alarm_id=alarm_id)
    if db_alarm is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alarm not found"
        )
    crud.delete_alarm(db, db_alarm=db_alarm)
    return {"detail": "Alarm deleted successfully"}
