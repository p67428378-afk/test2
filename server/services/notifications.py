import logging

logger = logging.getLogger("notifications")


class NotificationService:
    def send_application_confirmation(self, seeker_email: str, job_title: str):
        msg = f"Notification sent to {seeker_email}: Your application for '{job_title}' has been successfully submitted."
        logger.info(msg)
        print(msg)

    def send_employer_alert(
        self, employer_email: str, seeker_email: str, job_title: str
    ):
        msg = f"Notification sent to {employer_email}: New application received from {seeker_email} for '{job_title}'."
        logger.info(msg)
        print(msg)

    def send_status_update_notification(
        self, seeker_email: str, job_title: str, new_status: str
    ):
        msg = f"Notification sent to {seeker_email}: Your application status for '{job_title}' has been updated to '{new_status}'."
        logger.info(msg)
        print(msg)


notification_service = NotificationService()
