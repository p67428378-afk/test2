
from sqlalchemy.orm import Session
from . import models, schemas
import uuid

def get_task(db: Session, task_id: uuid.UUID):
    return db.query(models.Task).filter(models.Task.id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(title=task.title)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: uuid.UUID, task: schemas.TaskUpdate):
    db_task = get_task(db, task_id)
    if db_task:
        if task.title is not None:
            db_task.title = task.title
        if task.completed is not None:
            db_task.completed = task.completed
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: uuid.UUID):
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task
