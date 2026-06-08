import uuid
from sqlalchemy import Column, DateTime, func, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base

class ShoppingList(Base):
    __tablename__ = "shopping_lists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_plan_id = Column(UUID(as_uuid=True), ForeignKey("meal_plans.id"))
    ingredients = Column(JSON)
    created_at = Column(DateTime, default=func.now())

    meal_plan = relationship("MealPlan", back_populates="shopping_list")
