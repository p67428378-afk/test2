from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import date, timedelta

from server.database import get_db
from server.schemas.meal_plan import MealPlan, MealPlanCreate, MealPlanInDB
from server.crud import meal_plan as crud_meal_plan

router = APIRouter()

@router.post("/", response_model=MealPlan)
def create_meal_plan(meal_plan: MealPlanCreate, db: Session = Depends(get_db)):
    # This is a placeholder for the actual meal plan generation logic
    # which would involve an AI/LLM call.
    # For now, we'll just create a meal plan with some dummy data.
    start_date = date.today()
    end_date = start_date + timedelta(days=6)
    db_meal_plan = crud_meal_plan.create_meal_plan(db=db, meal_plan=meal_plan, start_date=start_date, end_date=end_date)
    
    # Dummy meal data
    meals = []
    for i in range(7):
        current_date = start_date + timedelta(days=i)
        meals.append({
            "date": current_date,
            "day_of_week": current_date.strftime("%A"),
            "recipe_id": uuid.uuid4(),
            "recipe_name": f"Dummy Recipe {i+1}"
        })

    return {
        "id": db_meal_plan.id,
        "user_id": db_meal_plan.user_id,
        "start_date": db_meal_plan.start_date,
        "end_date": db_meal_plan.end_date,
        "meals": meals
    }


@router.get("/{user_id}", response_model=List[MealPlanInDB])
def read_meal_plans(user_id: uuid.UUID, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    meal_plans = crud_meal_plan.get_meal_plans_by_user(db, user_id=user_id, skip=skip, limit=limit)
    if not meal_plans:
        raise HTTPException(status_code=404, detail="User not found")
    return meal_plans
