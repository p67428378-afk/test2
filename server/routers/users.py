from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server import models
from server.schemas import RoundupSettingsResponse, RoundupSettingsUpdate

router = APIRouter(prefix="/users", tags=["users"])


# Mock dependency to get current user. In a real app, this would decode a JWT token.
def get_current_user(db: Session = Depends(get_db)) -> models.User:
    user = db.query(models.User).first()
    if not user:
        # Seed a default user if none exists
        user = models.User(email="test@example.com", is_roundup_enabled=False)
        db.add(user)
        db.commit()
        db.refresh(user)

        # Also seed a linked account for this user
        linked_acc = models.LinkedAccount(
            user_id=user.id,
            plaid_access_token="mock_plaid_token_123",
            account_name="Primary Debit Card",
        )
        db.add(linked_acc)
        db.commit()
    return user


@router.get("/me/roundup-settings", response_model=RoundupSettingsResponse)
def get_roundup_settings(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    linked_acc = (
        db.query(models.LinkedAccount)
        .filter(models.LinkedAccount.user_id == current_user.id)
        .first()
    )
    return RoundupSettingsResponse(
        is_roundup_enabled=current_user.is_roundup_enabled,
        linked_account_id=linked_acc.id if linked_acc else None,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )


@router.put("/me/roundup-settings", response_model=RoundupSettingsResponse)
def update_roundup_settings(
    settings_update: RoundupSettingsUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.is_roundup_enabled = settings_update.is_roundup_enabled
    db.commit()
    db.refresh(current_user)

    linked_acc = (
        db.query(models.LinkedAccount)
        .filter(models.LinkedAccount.user_id == current_user.id)
        .first()
    )
    return RoundupSettingsResponse(
        is_roundup_enabled=current_user.is_roundup_enabled,
        linked_account_id=linked_acc.id if linked_acc else None,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )
