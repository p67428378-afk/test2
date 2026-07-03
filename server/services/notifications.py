import logging

logger = logging.getLogger(__name__)


def send_parent_notification(
    parent_contact: str, student_name: str, status: str, method: str
) -> str:
    """
    Simulates sending a notification to a parent.
    Returns 'Sent' or 'Failed'.
    """
    logger.info(
        f"Sending {method} to {parent_contact} regarding student {student_name} status: {status}"
    )
    # In a real system, this would call Twilio or SendGrid.
    # We will simulate a successful send.
    return "Sent"
