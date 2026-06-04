from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas, models, dependencies

router = APIRouter()

@router.post("/", response_model=schemas.Transfer)
def transfer_funds(
    transfer: schemas.TransferCreate,
    current_user: models.User = Depends(dependencies.get_current_user),
    db: Session = Depends(dependencies.get_db)
):
    from_account = crud.get_account(db, account_id=transfer.from_account_id)
    to_account = crud.get_account(db, account_id=transfer.to_account_id)

    if not from_account or from_account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="From account not found")

    if not to_account or to_account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="To account not found")

    if from_account.balance < transfer.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    return crud.create_transfer(db=db, transfer=transfer, from_account=from_account, to_account=to_account)
