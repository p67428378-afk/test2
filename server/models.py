import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, ForeignKey, Table, DateTime
from sqlalchemy.orm import relationship
from server.database import Base


# Helper function to generate UUIDs as strings
def generate_uuid():
    return str(uuid.uuid4())


# Helper function to get current UTC time
def get_utc_now():
    return datetime.now(timezone.utc)


# Association table for Favorites (Many-to-Many between User and Recipe)
favorites = Table(
    "favorites",
    Base.metadata,
    Column(
        "user_id",
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "recipe_id",
        String(36),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# Association table for RecipeDietaryTags (Many-to-Many between Recipe and DietaryTag)
recipe_dietary_tags = Table(
    "recipe_dietary_tags",
    Base.metadata,
    Column(
        "recipe_id",
        String(36),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id",
        String(36),
        ForeignKey("dietary_tags.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(255), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="member")
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False
    )

    recipes = relationship(
        "Recipe", back_populates="owner", cascade="all, delete-orphan"
    )
    favorite_recipes = relationship(
        "Recipe", secondary=favorites, back_populates="favorited_by"
    )


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, unique=True)

    recipes = relationship("Recipe", back_populates="category")


class DietaryTag(Base):
    __tablename__ = "dietary_tags"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, unique=True)

    recipes = relationship(
        "Recipe", secondary=recipe_dietary_tags, back_populates="dietary_tags"
    )


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, unique=True)

    recipe_associations = relationship(
        "RecipeIngredient", back_populates="ingredient", cascade="all, delete-orphan"
    )


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    recipe_id = Column(
        String(36), ForeignKey("recipes.id", ondelete="CASCADE"), primary_key=True
    )
    ingredient_id = Column(
        String(36), ForeignKey("ingredients.id", ondelete="CASCADE"), primary_key=True
    )
    quantity = Column(String(50), nullable=False)
    unit = Column(String(50), nullable=True)

    recipe = relationship("Recipe", back_populates="ingredient_associations")
    ingredient = relationship("Ingredient", back_populates="recipe_associations")


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    prep_time = Column(Integer, nullable=False, default=0)
    cook_time = Column(Integer, nullable=False, default=0)
    servings = Column(Integer, nullable=False, default=1)
    instructions = Column(String(5000), nullable=False)
    user_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    category_id = Column(
        String(36), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(
        DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False
    )

    owner = relationship("User", back_populates="recipes")
    category = relationship("Category", back_populates="recipes")
    ingredient_associations = relationship(
        "RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan"
    )
    dietary_tags = relationship(
        "DietaryTag", secondary=recipe_dietary_tags, back_populates="recipes"
    )
    favorited_by = relationship(
        "User", secondary=favorites, back_populates="favorite_recipes"
    )
