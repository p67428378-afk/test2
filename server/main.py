from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import traceback

from server.database import Base, engine, get_db, SessionLocal
from server.models import Product, Scenario, ScenarioItem, Approval
from server.seed import seed_db
import server.crud as crud
import server.schemas as schemas

# Create tables and seed
try:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Product).count() == 0:
            seed_db(db)
    finally:
        db.close()
except Exception as e:
    print("STARTUP ERROR:")
    traceback.print_exc()

app = FastAPI(
    title="DG Cluster Assortment Advisor API",
    description="Decision-support tool for Dollar General category managers",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the DG Cluster Assortment Advisor API"}

@app.get("/api/v1/dashboard/kpis", response_model=schemas.KPIDashboardResponse)
def get_dashboard_kpis(db: Session = Depends(get_db)):
    try:
        return crud.get_kpis(db)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/dashboard/skus", response_model=List[schemas.SKUPerformanceResponse])
def get_dashboard_skus(db: Session = Depends(get_db)):
    try:
        return crud.get_skus(db)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(get_db)):
    try:
        return crud.get_scenarios(db)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/scenarios/select", response_model=schemas.ScenarioSelectResponse)
def select_scenario(request: schemas.ScenarioSelectRequest, db: Session = Depends(get_db)):
    try:
        scenario = crud.select_scenario(db, request.scenario_id)
        if not scenario:
            raise HTTPException(status_code=400, detail="Invalid scenario ID")
        return {
            "selected_scenario_id": scenario.scenario_id,
            "success": True
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/approvals", response_model=schemas.ApprovalResponse)
def submit_approval(request: schemas.ApprovalRequest, db: Session = Depends(get_db)):
    try:
        approval, status = crud.create_approval(db, request.scenario_id, request.approver_name)
        if not approval:
            if status:
                # Guardrail check failed
                raise HTTPException(status_code=400, detail="Guardrail check failed")
            else:
                # Invalid scenario ID
                raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
        return {
            "approval_id": approval.approval_id,
            "approver_name": approval.approver_name,
            "guardrail_status": {
                "new_sku_limit_check": status.new_sku_limit_check,
                "private_brand_check": status.private_brand_check,
                "shelf_space_check": status.shelf_space_check
            },
            "selected_scenario": approval.scenario_id,
            "success": True,
            "timestamp": approval.timestamp.isoformat()
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
