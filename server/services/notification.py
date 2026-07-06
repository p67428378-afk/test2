import logging

logger = logging.getLogger(__name__)


class NotificationService:
    @staticmethod
    def send_sms(mobile_number: str, message: str) -> bool:
        # Mock SMS sending
        logger.info(f"Sending SMS to {mobile_number}: {message}")
        print(f"[SMS SENT] To: {mobile_number} | Msg: {message}")
        return True

    @staticmethod
    def send_push(user_id: str, title: str, body: str) -> bool:
        # Mock Push Notification sending
        logger.info(f"Sending Push to User {user_id}: {title} - {body}")
        print(f"[PUSH SENT] To User: {user_id} | Title: {title} | Body: {body}")
        return True
