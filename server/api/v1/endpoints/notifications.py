from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post(
    "/notifications/configure", response_model=schemas.NotificationSettingsResponse
)
def configure_notifications(
    request: schemas.NotificationSettingsConfigureRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    settings = crud.update_notification_settings(
        db,
        user_id=current_user.id,
        inactive_days_threshold=request.inactive_days_threshold,
        cost_per_visit_threshold=request.cost_per_visit_threshold,
        email_notifications_enabled=request.email_notifications_enabled,
    )
    return settings
