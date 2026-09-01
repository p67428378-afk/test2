"""Escalation trigger service for high priority and overdue tasks."""

import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from server.models import EscalationLog, Project, Task, User


def check_and_trigger_escalation(
    db: Session, task: Task, custom_reason: Optional[str] = None
) -> Optional[EscalationLog]:
    """Check task conditions and trigger escalation log/notification if priority is High/Urgent or overdue."""
    now = datetime.now(timezone.utc)
    is_high_priority = task.priority in ["High", "Urgent"]
    is_overdue = False
    if task.due_date and task.status not in ["Done", "Completed"]:
        # ensure due_date has timezone info or compare UTC
        due = task.due_date
        if due.tzinfo is None:
            due = due.replace(tzinfo=timezone.utc)
        if due < now:
            is_overdue = True

    if not is_high_priority and not is_overdue and not custom_reason:
        return None

    reasons = []
    if custom_reason:
        reasons.append(custom_reason)
    else:
        if is_high_priority:
            reasons.append(f"Task priority set to {task.priority}")
        if is_overdue:
            reasons.append("Task is past due date")

    reason_str = "; ".join(reasons)

    # Determine recipient
    notified_user_id = None
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if project and project.owner_id:
        notified_user_id = project.owner_id
    else:
        # Fallback to system admin
        admin_user = db.query(User).filter(User.role == "Admin").first()
        if admin_user:
            notified_user_id = admin_user.id

    escalation = EscalationLog(
        id=str(uuid.uuid4()),
        task_id=task.id,
        project_id=task.project_id,
        reason=reason_str,
        notified_user_id=notified_user_id,
        created_at=now,
    )
    db.add(escalation)
    try:
        db.commit()
        db.refresh(escalation)
        return escalation
    except Exception:
        db.rollback()
        return None
