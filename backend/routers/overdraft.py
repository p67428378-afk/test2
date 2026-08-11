from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/overdraft",
    tags=["overdraft"],
    responses={404: {"description": "Not found"}},
)

# Dummy function to simulate getting current user's ID
def get_current_user_id():
    return "cust123" # Hardcoded for now

@router.post("/link-account", response_model=schemas.AccountLinkResponse)
def link_account(
    request: schemas.AccountLinkRequest,
    db: Session = Depends(get_db),
    customer_id: str = Depends(get_current_user_id)
):
    # Check if accounts belong to the user (simulated)
    if not (request.checking_account_id.startswith("chk") and request.savings_account_id.startswith("sav")):
        raise HTTPException(status_code=400, detail="Invalid account IDs or accounts do not belong to user.")

    # Check if already linked
    db_linked_account = crud.get_linked_account(db, request.checking_account_id)
    if db_linked_account:
        raise HTTPException(status_code=400, detail="Checking account already has a linked savings account.")

    linked_account_create = schemas.LinkedAccountCreate(
        customer_id=customer_id,
        checking_account_id=request.checking_account_id,
        savings_account_id=request.savings_account_id
    )
    db_linked_account = crud.create_linked_account(db, linked_account_create)
    return {"message": "Account linked successfully", "linked_account": db_linked_account}

@router.delete("/unlink-account/{checking_account_id}", response_model=dict)
def unlink_account(
    checking_account_id: str,
    db: Session = Depends(get_db),
    customer_id: str = Depends(get_current_user_id)
):
    db_linked_account = crud.get_linked_account(db, checking_account_id)
    if not db_linked_account or db_linked_account.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Linked account not found or does not belong to user.")

    crud.delete_linked_account(db, checking_account_id)
    return {"message": "Account unlinked successfully"}

@router.get("/linked-account/{checking_account_id}", response_model=schemas.LinkedAccount)
def get_linked_account(
    checking_account_id: str,
    db: Session = Depends(get_db),
    customer_id: str = Depends(get_current_user_id)
):
    db_linked_account = crud.get_linked_account(db, checking_account_id)
    if not db_linked_account or db_linked_account.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Linked account not found or does not belong to user.")
    return db_linked_account

@router.put("/linked-account/{checking_account_id}/status", response_model=schemas.LinkedAccount)
def update_overdraft_protection_status(
    checking_account_id: str,
    status_update: schemas.OverdraftProtectionStatusUpdate,
    db: Session = Depends(get_db),
    customer_id: str = Depends(get_current_user_id)
):
    db_linked_account = crud.get_linked_account(db, checking_account_id)
    if not db_linked_account or db_linked_account.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Linked account not found or does not belong to user.")

    updated_account = crud.update_linked_account_status(db, checking_account_id, status_update.is_enabled)
    return updated_account

@router.get("/{checking_account_id}/history", response_model=List[schemas.OverdraftTransferEvent])
def get_overdraft_history(
    checking_account_id: str,
    db: Session = Depends(get_db),
    customer_id: str = Depends(get_current_user_id),
    skip: int = 0,
    limit: int = 100
):
    # In a real app, verify checking_account_id belongs to customer_id
    history = crud.get_overdraft_transfer_events(db, checking_account_id, skip=skip, limit=limit)
    return history

@router.get("/preferences/{customer_id}", response_model=schemas.UserNotificationPreferences)
def get_notification_preferences(
    customer_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    if customer_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these preferences.")
    return crud.get_notification_preferences(customer_id)

@router.put("/preferences/{customer_id}", response_model=schemas.UserNotificationPreferences)
def update_notification_preferences(
    customer_id: str,
    preferences: schemas.NotificationPreferenceUpdate,
    current_user_id: str = Depends(get_current_user_id)
):
    if customer_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update these preferences.")
    return crud.update_notification_preferences(customer_id, preferences)
