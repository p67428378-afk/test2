from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db

router = APIRouter()


# Mock dependency to get current user. In a real app, this would decode a JWT token.
# For simplicity and testing, we'll fetch the first user in the database or raise 401.
def get_current_user(db: Session = Depends(get_db)) -> models.User:
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized or invalid auth token",
        )
    return user


@router.post(
    "/transaction-responses", response_model=schemas.TransactionResponseResponse
)
def process_transaction_response(
    payload: schemas.TransactionResponseRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if payload.decision not in ["APPROVE", "BLOCK"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid request body or decision value",
        )

    notification = crud.get_notification(db, payload.notification_id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification or transaction not found",
        )

    if notification.transaction_id != payload.transaction_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Transaction ID mismatch"
        )

    if notification.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Transaction has already been actioned",
        )

    notification.status = "APPROVED" if payload.decision == "APPROVE" else "BLOCKED"
    notification.decision = payload.decision
    notification.response_channel = "WEB"
    db.commit()
    db.refresh(notification)

    return schemas.TransactionResponseResponse(
        message="Decision processed successfully", status="success"
    )


@router.get("/notifications", response_model=schemas.NotificationListResponse)
def list_notifications(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    items, total = crud.get_notifications_by_user(db, current_user.id)
    return schemas.NotificationListResponse(items=items, total=total)
