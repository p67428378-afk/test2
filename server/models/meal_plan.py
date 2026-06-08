import uuid
from sqlalchemy import Column, DateTime, func, ForeignKey, Date, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base

meal_plan_recipes = Table(
    "meal_plan_recipes",
    Base.metadata,
    Column("meal_plan_id", UUID(as_uuid=True), ForeignKey("meal_plans.id"), primary_key=True),
    Column("recipe_id", UUID(as_uuid=True), ForeignKey("recipes.id"), primary_key=True),
    Column("date", Date, nullable=False),
    Column("day_of_week", String, nullable=False),
)

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="meal_plans")
    recipes = relationship("Recipe", secondary=meal_plan_recipes, back_populates="meal_plans")
    shopping_list = relationship("ShoppingList", back_populates="meal_plan", uselist=False)
