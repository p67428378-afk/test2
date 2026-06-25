from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List
import uuid
from server import crud, schemas
from server.database import get_db
from server.core.sweep_engine import execute_eod_sweeps

router = APIRouter()


# Accounts Endpoints
@router.get("/accounts", response_model=List[schemas.AccountResponse])
def read_accounts(db: Session = Depends(get_db)):
    return crud.get_accounts(db)


@router.post(
    "/accounts",
    response_model=schemas.AccountResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    db_account = crud.get_account_by_number(db, account.account_number)
    if db_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account number already exists",
        )
    return crud.create_account(db, account)


# Sweep Rules Endpoints
@router.get("/sweep-rules", response_model=List[schemas.SweepRuleResponse])
def read_sweep_rules(db: Session = Depends(get_db)):
    return crud.get_sweep_rules(db)


@router.post(
    "/sweep-rules",
    response_model=schemas.SweepRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sweep_rule(rule: schemas.SweepRuleCreate, db: Session = Depends(get_db)):
    # Validate source and hub accounts exist
    source_acc = (
        db.query(crud.models.Account)
        .filter(crud.models.Account.id == rule.source_account_id)
        .first()
    )
    hub_acc = (
        db.query(crud.models.Account)
        .filter(crud.models.Account.id == rule.hub_account_id)
        .first()
    )
    if not source_acc or not hub_acc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Source or hub account not found",
        )
    return crud.create_sweep_rule(db, rule)


@router.put("/sweep-rules/{id}", response_model=schemas.SweepRuleResponse)
def update_sweep_rule(
    id: uuid.UUID, rule_update: schemas.SweepRuleUpdate, db: Session = Depends(get_db)
):
    db_rule = crud.update_sweep_rule(db, id, rule_update)
    if not db_rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sweep rule not found"
        )
    return db_rule


@router.delete("/sweep-rules/{id}", response_model=schemas.DeleteResponse)
def delete_sweep_rule(id: uuid.UUID, db: Session = Depends(get_db)):
    success = crud.delete_sweep_rule(db, id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sweep rule not found"
        )
    return schemas.DeleteResponse(
        message="Sweep rule deleted successfully", status="SUCCESS"
    )


# Hedge Rules Endpoints
@router.get("/hedge-rules", response_model=List[schemas.HedgeRuleResponse])
def read_hedge_rules(db: Session = Depends(get_db)):
    return crud.get_hedge_rules(db)


@router.post(
    "/hedge-rules",
    response_model=schemas.HedgeRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_hedge_rule(rule: schemas.HedgeRuleCreate, db: Session = Depends(get_db)):
    return crud.create_hedge_rule(db, rule)


@router.put("/hedge-rules/{id}", response_model=schemas.HedgeRuleResponse)
def update_hedge_rule(
    id: uuid.UUID, rule_update: schemas.HedgeRuleUpdate, db: Session = Depends(get_db)
):
    db_rule = crud.update_hedge_rule(db, id, rule_update)
    if not db_rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hedging rule not found"
        )
    return db_rule


@router.delete("/hedge-rules/{id}", response_model=schemas.DeleteResponse)
def delete_hedge_rule(id: uuid.UUID, db: Session = Depends(get_db)):
    success = crud.delete_hedge_rule(db, id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Hedging rule not found"
        )
    return schemas.DeleteResponse(
        message="Hedging rule deleted successfully", status="SUCCESS"
    )


# Activity Logs Endpoint
@router.get("/activity-logs", response_model=schemas.ActivityLogsPaginated)
def read_activity_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    logs, total = crud.get_activity_logs(
        db, skip=skip, limit=limit, status=status, type=type
    )
    return schemas.ActivityLogsPaginated(logs=logs, total=total)


# Trigger Sweep Endpoint
@router.post("/sweeps/trigger", response_model=schemas.TriggerSweepResponse)
def trigger_sweep(payload: schemas.TriggerSweepRequest, db: Session = Depends(get_db)):
    try:
        result = execute_eod_sweeps(db, region=payload.region)
        return schemas.TriggerSweepResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal execution error: {str(e)}",
        )


# Dashboard Endpoints
@router.get("/dashboard/stats", response_model=schemas.DashboardStatsResponse)
def read_dashboard_stats(db: Session = Depends(get_db)):
    return crud.get_dashboard_stats(db)


@router.get("/dashboard/charts", response_model=schemas.DashboardChartsResponse)
def read_dashboard_charts(db: Session = Depends(get_db)):
    return crud.get_dashboard_charts(db)
