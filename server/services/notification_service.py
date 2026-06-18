"""
Module: server/services/notification_service.py
Purpose: Real-time notifications (email, push) for critical stages of the sweep process
"""

from sqlalchemy.orm import Session
from server import crud


class NotificationService:
    @staticmethod
    def send_notification(
        db: Session, user_id: str, type_: str, title: str, message: str
    ) -> dict:
        """
        Simulate sending a notification and log it to the database.
        """
        log_data = {
            "user_id": user_id,
            "type": type_,
            "title": title,
            "message": message,
            "status": "SENT",
        }
        db_log = crud.create_notification_log(db, log_data)

        # Print or log to console for simulation
        print(
            f"[NOTIFICATION SENT] Type: {type_} | Title: {title} | Message: {message}"
        )

        return {"id": db_log.id, "status": "SENT"}
