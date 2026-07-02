import logging

logger = logging.getLogger("notifications")

# In-memory list of sent notifications for testing/verification
sent_notifications = []


def send_email(to_email: str, subject: str, body: str):
    logger.info(f"Sending email to {to_email} | Subject: {subject} | Body: {body}")
    sent_notifications.append({"to_email": to_email, "subject": subject, "body": body})


def notify_status_update(
    reporter_email: str, incident_id: str, old_status: str, new_status: str
):
    subject = f"Incident {incident_id} Status Updated"
    body = f"The status of your reported incident {incident_id} has been updated from '{old_status}' to '{new_status}'."
    send_email(reporter_email, subject, body)


def notify_sla_breach(incident_id: str, priority: str, elapsed_minutes: float):
    subject = f"SLA BREACH: Incident {incident_id} ({priority})"
    body = f"Incident {incident_id} with priority {priority} has breached its SLA. Elapsed time: {elapsed_minutes:.1f} minutes. Escalating to Tier 2 support."
    # Email the IT manager
    send_email("it_manager@example.com", subject, body)
