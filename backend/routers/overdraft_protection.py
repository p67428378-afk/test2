from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, models
from ..database import get_db

router = APIRouter(
    prefix="/api/v1/overdraft-protection",
    tags=["Overdraft Protection"],
)

@router.post("/link-account", response_model=schemas.AccountConfigurationResponse, status_code=status.HTTP_200_OK)
def link_account(
    account_config: schemas.AccountConfigurationCreate,
    db: Session = Depends(get_db)
):
    # Check if checking_account_id already exists
    existing_checking_account = db.query(models.AccountConfiguration).filter(
        models.AccountConfiguration.checking_account_id == account_config.checking_account_id
    ).first()
    if existing_checking_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Account with checking_account_id {account_config.checking_account_id} already exists"
        )

    # Check if savings_account_id already exists
    existing_savings_account = db.query(models.AccountConfiguration).filter(
        models.AccountConfiguration.savings_account_id == account_config.savings_account_id
    ).first()
    if existing_savings_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Account with savings_account_id {account_config.savings_account_id} already exists"
        )

    db_account_config = models.AccountConfiguration(**account_config.model_dump())
    db.add(db_account_config)
    db.commit()
    db.refresh(db_account_config)
    return db_account_config

@router.get("/account/{account_id}", response_model=schemas.AccountConfigurationResponse)
def get_account_configuration(
    account_id: str,
    db: Session = Depends(get_db)
):
    account_config = db.query(models.AccountConfiguration).filter(
        models.AccountConfiguration.id == account_id
    ).first()
    if not account_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account configuration not found"
        )
    return account_config

@router.put("/account/{account_id}", response_model=schemas.AccountConfigurationResponse)
def update_account_configuration(
    account_id: str,
    account_update: schemas.AccountConfigurationUpdate,
    db: Session = Depends(get_db)
):
    db_account_config = db.query(models.AccountConfiguration).filter(
        models.AccountConfiguration.id == account_id
    ).first()
    if not db_account_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account configuration not found"
        )

    update_data = account_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_account_config, key, value)

    db.add(db_account_config)
    db.commit()
    db.refresh(db_account_config)
    return db_account_config

@router.delete("/account/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account_configuration(
    account_id: str,
    db: Session = Depends(get_db)
):
    db_account_config = db.query(models.AccountConfiguration).filter(
        models.AccountConfiguration.id == account_id
    ).first()
    if not db_account_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account configuration not found"
        )

    db.delete(db_account_config)
    db.commit()
    return {"message": "Account configuration deleted successfully"}
