"""Database CRUD operations for users, projects, tasks, comments, and analytics."""

import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session
from server.database import get_password_hash
from server.models import Comment, Project, Task, User
from server.schemas import (
    CommentCreate,
    CommentUpdate,
    ProjectCreate,
    ProjectUpdate,
    TaskCreate,
    TaskUpdate,
    UserCreate,
)
from server.services.escalation import check_and_trigger_escalation


# User CRUD
def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(func.lower(User.email) == email.lower()).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    role = user_in.role if user_in.role in ["Admin", "Member"] else "Member"
    now = datetime.now(timezone.utc)
    db_user = User(
        id=str(uuid.uuid4()),
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        role=role,
        hashed_password=get_password_hash(user_in.password),
        is_active=True,
        is_verified=True,
        created_at=now,
        updated_at=now,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def list_users(db: Session, skip: int = 0, limit: int = 50) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


# Project CRUD
def get_project(db: Session, project_id: str) -> Optional[Project]:
    return db.query(Project).filter(Project.id == project_id).first()


def list_projects(
    db: Session,
    status: Optional[str] = None,
    owner_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Project]:
    query = db.query(Project)
    if status:
        query = query.filter(Project.status == status)
    if owner_id:
        query = query.filter(Project.owner_id == owner_id)
    return query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()


def create_project(db: Session, project_in: ProjectCreate, owner_id: str) -> Project:
    now = datetime.now(timezone.utc)
    db_project = Project(
        id=str(uuid.uuid4()),
        name=project_in.name,
        description=project_in.description,
        status=project_in.status or "Planning",
        owner_id=owner_id,
        created_at=now,
        updated_at=now,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project: Project, project_in: ProjectUpdate) -> Project:
    if project_in.name is not None:
        project.name = project_in.name
    if project_in.description is not None:
        project.description = project_in.description
    if project_in.status is not None:
        project.status = project_in.status
    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()


# Task CRUD
def get_task(db: Session, task_id: str) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def list_tasks(
    db: Session,
    project_id: Optional[str] = None,
    assignee_id: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Task]:
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if assignee_id:
        query = query.filter(Task.assignee_id == assignee_id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    return query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()


def create_task(db: Session, task_in: TaskCreate) -> Task:
    now = datetime.now(timezone.utc)
    completed_at = now if task_in.status in ["Done", "Completed"] else None
    db_task = Task(
        id=str(uuid.uuid4()),
        project_id=task_in.project_id,
        assignee_id=task_in.assignee_id,
        summary=task_in.summary,
        description=task_in.description,
        priority=task_in.priority or "Medium",
        status=task_in.status or "To Do",
        due_date=task_in.due_date,
        created_at=now,
        updated_at=now,
        completed_at=completed_at,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    # Check for escalation
    check_and_trigger_escalation(db, db_task)

    return db_task


def update_task(db: Session, task: Task, task_in: TaskUpdate) -> Task:
    now = datetime.now(timezone.utc)
    if task_in.summary is not None:
        task.summary = task_in.summary
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.priority is not None:
        task.priority = task_in.priority
    if task_in.assignee_id is not None:
        task.assignee_id = task_in.assignee_id
    if task_in.due_date is not None:
        task.due_date = task_in.due_date
    if task_in.status is not None:
        prev_status = task.status
        task.status = task_in.status
        if task_in.status in ["Done", "Completed"] and prev_status not in [
            "Done",
            "Completed",
        ]:
            task.completed_at = now
        elif task_in.status not in ["Done", "Completed"]:
            task.completed_at = None

    task.updated_at = now
    db.commit()
    db.refresh(task)

    # Check for escalation
    check_and_trigger_escalation(db, task)

    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()


def bulk_update_tasks(
    db: Session, task_ids: List[str], target_status: str
) -> List[Task]:
    """Atomically update status for all specified task IDs."""
    now = datetime.now(timezone.utc)
    completed_at_val = now if target_status in ["Done", "Completed"] else None

    # Fetch all tasks matching IDs
    tasks = db.query(Task).filter(Task.id.in_(task_ids)).all()
    found_ids = {t.id for t in tasks}

    # Verify all task_ids exist
    missing_ids = [tid for tid in task_ids if tid not in found_ids]
    if missing_ids:
        raise ValueError(f"Tasks not found for IDs: {missing_ids}")

    for task in tasks:
        task.status = target_status
        task.updated_at = now
        if completed_at_val is not None:
            task.completed_at = completed_at_val
        else:
            task.completed_at = None

    db.commit()
    for task in tasks:
        db.refresh(task)
    return tasks


# Comment CRUD
def get_comment(db: Session, comment_id: str) -> Optional[Comment]:
    return db.query(Comment).filter(Comment.id == comment_id).first()


def list_comments(
    db: Session, task_id: str, skip: int = 0, limit: int = 50
) -> List[Comment]:
    return (
        db.query(Comment)
        .filter(Comment.task_id == task_id)
        .order_by(Comment.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_comment(
    db: Session, task_id: str, author_id: str, comment_in: CommentCreate
) -> Comment:
    now = datetime.now(timezone.utc)
    db_comment = Comment(
        id=str(uuid.uuid4()),
        task_id=task_id,
        author_id=author_id,
        body=comment_in.body,
        created_at=now,
        updated_at=now,
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def update_comment(db: Session, comment: Comment, comment_in: CommentUpdate) -> Comment:
    comment.body = comment_in.body
    comment.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(comment)
    return comment


def delete_comment(db: Session, comment: Comment) -> None:
    db.delete(comment)
    db.commit()


# Analytics
def get_task_analytics(db: Session, project_id: Optional[str] = None) -> Dict:
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    tasks = query.all()

    total_tasks = len(tasks)
    status_counts: Dict[str, int] = {}
    priority_counts: Dict[str, int] = {}
    completed_tasks = 0
    in_progress_tasks = 0
    todo_tasks = 0

    for t in tasks:
        status_counts[t.status] = status_counts.get(t.status, 0) + 1
        priority_counts[t.priority] = priority_counts.get(t.priority, 0) + 1
        if t.status in ["Done", "Completed"]:
            completed_tasks += 1
        elif t.status == "In Progress":
            in_progress_tasks += 1
        else:
            todo_tasks += 1

    completion_rate = (
        round((completed_tasks / total_tasks * 100.0), 2) if total_tasks > 0 else 0.0
    )

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "in_progress_tasks": in_progress_tasks,
        "todo_tasks": todo_tasks,
        "completion_rate": completion_rate,
        "status_distribution": status_counts,
        "priority_distribution": priority_counts,
    }


def get_productivity_analytics(db: Session, project_id: Optional[str] = None) -> Dict:
    query = db.query(Task).filter(Task.status.in_(["Done", "Completed"]))
    if project_id:
        query = query.filter(Task.project_id == project_id)
    completed_tasks = query.all()

    cycle_times = []
    assignee_stats: Dict[str, Dict] = {}

    for t in completed_tasks:
        if t.completed_at and t.created_at:
            # Calculate duration in hours
            diff = (t.completed_at - t.created_at).total_seconds() / 3600.0
            cycle_times.append(diff)

        assignee_id = t.assignee_id or "Unassigned"
        if assignee_id not in assignee_stats:
            assignee_stats[assignee_id] = {
                "assignee_id": assignee_id,
                "completed_tasks": 0,
            }
        assignee_stats[assignee_id]["completed_tasks"] += 1

    avg_cycle_time = (
        round(sum(cycle_times) / len(cycle_times), 2) if cycle_times else 0.0
    )

    return {
        "average_cycle_time_hours": avg_cycle_time,
        "total_completed_tasks": len(completed_tasks),
        "productivity_by_assignee": list(assignee_stats.values()),
    }
