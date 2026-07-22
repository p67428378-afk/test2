import logging

logger = logging.getLogger("server.services.email")


def send_alert_email(to_email: str, subject: str, body: str) -> bool:
    """Mock email sending service.
    In production, this would connect to SendGrid, Mailgun, or an SMTP server.
    """
    logger.info(f"Sending email to {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body:\n{body}\n" + "=" * 40)
    print(f"MOCK EMAIL SENT to {to_email} | Subject: {subject}")
    return True
