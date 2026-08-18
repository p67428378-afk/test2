from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from server.models import (
    User,
    Category,
    DietaryTag,
    Ingredient,
    RecipeIngredient,
    Recipe,
)
from server.schemas import UserCreate, RecipeCreate, RecipeUpdate
from server.core.security import get_password_hash


# User CRUD
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_pw = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pw,
        role="member",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Category CRUD
def get_categories(db: Session) -> List[Category]:
    return db.query(Category).all()


# Recipe CRUD
def create_recipe(db: Session, recipe_in: RecipeCreate, user_id: str) -> Recipe:
    db_recipe = Recipe(
        title=recipe_in.title,
        description=recipe_in.description,
        prep_time=recipe_in.prep_time,
        cook_time=recipe_in.cook_time,
        servings=recipe_in.servings,
        instructions=recipe_in.instructions,
        user_id=user_id,
        category_id=recipe_in.category_id,
    )
    db.add(db_recipe)
    db.flush()  # Get recipe ID

    # Handle Ingredients
    for ing_item in recipe_in.ingredients:
        # Find or create ingredient
        db_ing = db.query(Ingredient).filter(Ingredient.name == ing_item.name).first()
        if not db_ing:
            db_ing = Ingredient(name=ing_item.name)
            db.add(db_ing)
            db.flush()

        # Create association
        assoc = RecipeIngredient(
            recipe_id=db_recipe.id,
            ingredient_id=db_ing.id,
            quantity=ing_item.quantity,
            unit=ing_item.unit,
        )
        db.add(assoc)

    # Handle Dietary Tags
    if recipe_in.dietary_tag_ids:
        tags = (
            db.query(DietaryTag)
            .filter(DietaryTag.id.in_(recipe_in.dietary_tag_ids))
            .all()
        )
        db_recipe.dietary_tags = tags

    db.commit()
    db.refresh(db_recipe)
    return db_recipe


def get_recipes(
    db: Session,
    user_id: Optional[str] = None,
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    dietary_tags: Optional[List[str]] = None,
    max_prep_time: Optional[int] = None,
    max_cook_time: Optional[int] = None,
    ingredients: Optional[List[str]] = None,
    favorites_only: bool = False,
) -> List[Recipe]:
    query = db.query(Recipe)

    if favorites_only and user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            query = query.filter(Recipe.id.in_([r.id for r in user.favorite_recipes]))

    if search:
        query = query.filter(
            or_(Recipe.title.icontains(search), Recipe.description.icontains(search))
        )

    if category_id:
        query = query.filter(Recipe.category_id == category_id)

    if max_prep_time is not None:
        query = query.filter(Recipe.prep_time <= max_prep_time)

    if max_cook_time is not None:
        query = query.filter(Recipe.cook_time <= max_cook_time)

    if dietary_tags:
        # Filter recipes that have ALL or ANY of the specified dietary tags
        for tag_name in dietary_tags:
            query = query.filter(Recipe.dietary_tags.any(DietaryTag.name == tag_name))

    if ingredients:
        # Filter recipes that contain any of the specified ingredients
        query = query.filter(
            Recipe.ingredient_associations.any(
                RecipeIngredient.ingredient.has(Ingredient.name.in_(ingredients))
            )
        )

    return query.all()


def get_recipe(db: Session, recipe_id: str) -> Optional[Recipe]:
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


def update_recipe(db: Session, db_recipe: Recipe, recipe_in: RecipeUpdate) -> Recipe:
    update_data = recipe_in.model_dump(exclude_unset=True)

    # Update basic fields
    for field in [
        "title",
        "description",
        "prep_time",
        "cook_time",
        "servings",
        "instructions",
        "category_id",
    ]:
        if field in update_data:
            setattr(db_recipe, field, update_data[field])

    # Update Ingredients if provided
    if "ingredients" in update_data and update_data["ingredients"] is not None:
        # Delete existing associations
        db.query(RecipeIngredient).filter(
            RecipeIngredient.recipe_id == db_recipe.id
        ).delete()

        # Add new associations
        for ing_item in update_data["ingredients"]:
            db_ing = (
                db.query(Ingredient).filter(Ingredient.name == ing_item["name"]).first()
            )
            if not db_ing:
                db_ing = Ingredient(name=ing_item["name"])
                db.add(db_ing)
                db.flush()

            assoc = RecipeIngredient(
                recipe_id=db_recipe.id,
                ingredient_id=db_ing.id,
                quantity=ing_item["quantity"],
                unit=ing_item.get("unit"),
            )
            db.add(assoc)

    # Update Dietary Tags if provided
    if "dietary_tag_ids" in update_data and update_data["dietary_tag_ids"] is not None:
        tags = (
            db.query(DietaryTag)
            .filter(DietaryTag.id.in_(update_data["dietary_tag_ids"]))
            .all()
        )
        db_recipe.dietary_tags = tags

    db.commit()
    db.refresh(db_recipe)
    return db_recipe


def delete_recipe(db: Session, db_recipe: Recipe) -> None:
    db.delete(db_recipe)
    db.commit()


# Favorites CRUD
def add_favorite(db: Session, user: User, recipe: Recipe) -> None:
    if recipe not in user.favorite_recipes:
        user.favorite_recipes.append(recipe)
        db.commit()


def remove_favorite(db: Session, user: User, recipe: Recipe) -> None:
    if recipe in user.favorite_recipes:
        user.favorite_recipes.remove(recipe)
        db.commit()
