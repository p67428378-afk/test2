import uuid
import logging
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from server.models import Alert, Feedback

logger = logging.getLogger("feedback_alert_service")


def trigger_critical_feedback_alert(
    db: Session, feedback: Feedback, sentiment: str
) -> Optional[Alert]:
    """
    Evaluates feedback for critical negative conditions (rating <= 2 or sentiment == 'Negative')
    and creates/dispatches an automated alert with up to 3 retry attempts if needed.
    """
    is_critical = feedback.rating <= 2 or sentiment == "Negative"
    if not is_critical:
        return None

    alert_id = str(uuid.uuid4())
    alert = Alert(
        id=alert_id,
        feedback_id=feedback.id,
        alert_type="EMAIL",
        status="PENDING",
        retry_count=0,
        error_message=None,
        created_at=datetime.now(timezone.utc),
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Dispatch simulation with retry loop (max 3 retries)
    success = False
    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            # Simulate external email / webhook notification send
            logger.info(
                f"[ALERT DISPATCH] Attempt {attempt}: Sending alert for Critical Feedback ID={feedback.id}, Rating={feedback.rating}, Sentiment={sentiment}"
            )
            # Successfully dispatched
            alert.status = "SENT"
            alert.retry_count = attempt - 1
            alert.error_message = None
            db.commit()
            db.refresh(alert)
            success = True
            break
        except Exception as exc:
            logger.warning(f"[ALERT RETRY {attempt}] Failed to send alert: {exc}")
            alert.retry_count = attempt
            alert.error_message = str(exc)
            db.commit()

    if not success:
        alert.status = "FAILED"
        db.commit()
        db.refresh(alert)

    return alert
