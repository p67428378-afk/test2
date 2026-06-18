import logging

logger = logging.getLogger("NotificationService")


class NotificationService:
    @staticmethod
    def send_notification(recipient: str, subject: str, body: str) -> bool:
        # Mock sending email/SMS
        logger.info(
            f"Sending notification to {recipient} | Subject: {subject} | Body: {body}"
        )
        print(f"[NOTIFICATION] To: {recipient} | Subject: {subject} | Body: {body}")
        return True

    @staticmethod
    def notify_treasury_manager(subject: str, body: str) -> bool:
        return NotificationService.send_notification(
            recipient="alex.mercer@corporate.com", subject=subject, body=body
        )
