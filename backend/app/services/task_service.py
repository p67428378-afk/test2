from sqlalchemy.orm import Session
from app.models import task as task_model
from app.schemas import task as task_schema

def get_task(db: Session, task_id: int):
    return db.query(task_model.Task).filter(task_model.Task.id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(task_model.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task: task_schema.TaskCreate):
    db_task = task_model.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: task_schema.TaskUpdate):
    db_task = get_task(db, task_id)
    if db_task:
        for key, value in task.dict().items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

def complete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)
    if db_task:
        db_task.is_complete = True
        db.commit()
        db.refresh(db_task)
    return db_task
