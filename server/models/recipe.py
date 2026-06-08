import uuid
from sqlalchemy import Column, String, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base
from server.models.meal_plan import meal_plan_recipes

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    preparation_tips = Column(String)
    ingredients = Column(JSON)

    meal_plans = relationship("MealPlan", secondary=meal_plan_recipes, back_populates="recipes")
