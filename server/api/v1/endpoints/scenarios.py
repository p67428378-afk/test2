from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server import schemas, crud, models
from server.database import get_db
from typing import List

router = APIRouter()

@router.get("/scenarios", response_model=List[schemas.ScenarioResponse])
def get_scenarios(db: Session = Depends(get_db)):
    try:
        return crud.get_scenarios(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scenarios/select", response_model=schemas.ScenarioSelectResponse)
def select_scenario(req: schemas.ScenarioSelectRequest, db: Session = Depends(get_db)):
    try:
        scenario = crud.get_scenario_by_id(db, req.scenario_id)
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
            
        name_lower = scenario.name.lower()
        actions = []
        guardrails = []
        
        # Find SKUs to populate actions
        brand_a = db.query(models.SKU).filter(models.SKU.name.like("%Tortilla Chips%")).first()
        brand_b = db.query(models.SKU).filter(models.SKU.name.like("%Cheese Puffs%")).first()
        brand_c = db.query(models.SKU).filter(models.SKU.name.like("%Popcorn%")).first()
        
        if "conservative" in name_lower:
            guardrails = [
                {"name": "Shelf capacity < 100%", "passed": True, "value": "84.5%"},
                {"name": "PB % meets target", "passed": False, "value": "24.9% (Target: 25.0%)"}
            ]
        elif "balanced" in name_lower:
            if brand_b:
                actions.append({"sku_id": brand_b.id, "sku_name": brand_b.name, "action": "SWAP"})
            if brand_c:
                actions.append({"sku_id": brand_c.id, "sku_name": brand_c.name, "action": "REDUCE"})
            guardrails = [
                {"name": "Shelf capacity < 100%", "passed": True, "value": "84.5%"},
                {"name": "PB % meets target", "passed": True, "value": "25.5% (Target: 25.0%)"}
            ]
        elif "aggressive" in name_lower:
            if brand_b:
                actions.append({"sku_id": brand_b.id, "sku_name": brand_b.name, "action": "SWAP"})
            if brand_a:
                actions.append({"sku_id": brand_a.id, "sku_name": brand_a.name, "action": "SWAP"})
            if brand_c:
                actions.append({"sku_id": brand_c.id, "sku_name": brand_c.name, "action": "REDUCE"})
            guardrails = [
                {"name": "Shelf capacity < 100%", "passed": True, "value": "84.5%"},
                {"name": "PB % meets target", "passed": True, "value": "26.2% (Target: 25.0%)"}
            ]
            
        return {
            "scenario_id": scenario.id,
            "name": scenario.name,
            "projected_sales_change_pct": scenario.projected_sales,
            "projected_profit_change_pct": scenario.projected_profit,
            "projected_private_brand_pct": scenario.projected_private_brand_pct,
            "actions": actions,
            "guardrails": guardrails
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
