import logging

logger = logging.getLogger("courier_notifications")


def send_milestone_notification(
    recipient_email: str, tracking_id: str, milestone: str, details: str = ""
):
    """
    Simulates sending an automated email or SMS notification for key delivery milestones.
    """
    subject = f"Shipment {tracking_id} Update: {milestone}"
    body = f"Dear Customer, your shipment with tracking ID {tracking_id} is now: {milestone}. {details}"

    # Log the notification to simulate sending
    logger.info(
        f"Sending notification to {recipient_email} | Subject: {subject} | Body: {body}"
    )
    print(
        f"[NOTIFICATION SENT] To: {recipient_email} | Subject: {subject} | Body: {body}"
    )
    return True
