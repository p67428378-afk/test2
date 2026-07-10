import logging

logger = logging.getLogger("email_service")


def send_email(to_email: str, subject: str, body: str) -> bool:
    # Mock email sending
    logger.info(f"Sending email to {to_email} | Subject: {subject} | Body: {body}")
    print(f"[EMAIL MOCK] To: {to_email} | Subject: {subject} | Body: {body}")
    return True
