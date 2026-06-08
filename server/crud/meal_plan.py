from sqlalchemy.orm import Session
import uuid
from server.models.meal_plan import MealPlan
from server.schemas.meal_plan import MealPlanCreate

def get_meal_plan(db: Session, meal_plan_id: uuid.UUID):
    return db.query(MealPlan).filter(MealPlan.id == meal_plan_id).first()

def get_meal_plans_by_user(db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 10):
    return db.query(MealPlan).filter(MealPlan.user_id == user_id).offset(skip).limit(limit).all()

def create_meal_plan(db: Session, meal_plan: MealPlanCreate, start_date: str, end_date: str):
    db_meal_plan = MealPlan(
        user_id=uuid.UUID(meal_plan.user_id),
        start_date=start_date,
        end_date=end_date,
    )
    db.add(db_meal_plan)
    db.commit()
    db.refresh(db_meal_plan)
    return db_meal_plan
