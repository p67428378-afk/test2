import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.v1.endpoints import password_reset
from server.database import Base, engine, SessionLocal
from server.models import Recipe, Ingredient, Instruction
from server import router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BakeKids API", description="Baking Recipes for Kids API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])
app.include_router(router.router, prefix="/api", tags=["recipes"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the BakeKids Baking Recipes API!"}


# Seed database on startup
def seed_db():
    db = SessionLocal()
    try:
        # Clear existing to avoid duplicates or stale data
        db.query(Instruction).delete()
        db.query(Ingredient).delete()
        db.query(Recipe).delete()
        db.commit()

        # Seed Chocolate Chip Cookies
        cookie_recipe = Recipe(
            id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
            name="Classic Chocolate Chip Cookies",
            description="Soft, chewy, and packed with chocolate chips! Perfect for little hands to mix.",
            image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuBgD3RYDsbh4MPRqsh3CHMrWXp41dj0Vk62qeNzjJmNB5RTXrk6iEJ1hlLieBEytHLeRhBwBjopAYIiTyP0oBA-NnwVwa667SI0osoNhozkJmJF405oRwa8SIeGIq_ipdCV02shiMUrmc5Y0REtJF07ISkT8-eR3Q33B0oxsW72UJm5bwO_sRRN4z1dU-v8Hsy7bizokI1qM6nMDeoiPKvyinXW1CnpSh6tKJuXbcjz_lFjqrm3tuWFtvGtosPhBQkYIaReE7Boays",
            difficulty="Super Easy",
            prep_time="15 mins",
            cook_time="10 mins"
        )
        db.add(cookie_recipe)
        
        # Ingredients for cookies
        cookie_ingredients = [
            Ingredient(name="Butter (softened)", quantity="1/2 cup", recipe_id=cookie_recipe.id),
            Ingredient(name="Sugar", quantity="1/2 cup", recipe_id=cookie_recipe.id),
            Ingredient(name="Brown Sugar", quantity="1/2 cup", recipe_id=cookie_recipe.id),
            Ingredient(name="Egg", quantity="1", recipe_id=cookie_recipe.id),
            Ingredient(name="Vanilla Extract", quantity="1 tsp", recipe_id=cookie_recipe.id),
            Ingredient(name="All-Purpose Flour", quantity="1.5 cups", recipe_id=cookie_recipe.id),
            Ingredient(name="Chocolate Chips", quantity="1 cup", recipe_id=cookie_recipe.id)
        ]
        for ing in cookie_ingredients:
            db.add(ing)
            
        # Instructions for cookies
        cookie_instructions = [
            Instruction(step_number=1, description="Preheat oven to 350°F (175°C) and line a baking sheet with parchment paper.", recipe_id=cookie_recipe.id),
            Instruction(step_number=2, description="Mix softened butter, sugar, and brown sugar in a bowl until fluffy.", recipe_id=cookie_recipe.id),
            Instruction(step_number=3, description="Add the egg and vanilla extract, then stir well.", recipe_id=cookie_recipe.id),
            Instruction(step_number=4, description="Gradually add flour and mix until a soft dough forms.", recipe_id=cookie_recipe.id),
            Instruction(step_number=5, description="Fold in the chocolate chips using a wooden spoon.", recipe_id=cookie_recipe.id),
            Instruction(step_number=6, description="Roll dough into small balls and place them on the baking sheet.", recipe_id=cookie_recipe.id),
            Instruction(step_number=7, description="Bake for 10 minutes until edges are golden brown. Let cool before eating!", recipe_id=cookie_recipe.id)
        ]
        for inst in cookie_instructions:
            db.add(inst)

        # Seed Vanilla Cupcakes
        cupcake_recipe = Recipe(
            id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
            name="Fluffy Vanilla Cupcakes",
            description="Sweet and fluffy cupcakes with colorful sprinkles on top. Fun to decorate!",
            image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuDz-SPspgNbnVqvlyhE9McSuHRzUeGuXnzwjbbRz2xgQCHUM8tFoUgUOAVh0Uu_zLcWa4Sq6jckxMJMt20Jy-zXLnxl0A7kxfknz_lh4VGqc2LTXNOMk61CIaZxoJ2tzTd-7lJ0SjjIFVvHIjoP1uEDSYhM2XnmDacD-exR8CauDA78cM7pQ3NTVTuzi1MXWutxtsPy_LKwThUiiRLbXZsdZ61apfCfwx_E2nsWikHiCXb5INli-OIWQIglRxZi4Y9eIebBltFedlw",
            difficulty="Easy",
            prep_time="20 mins",
            cook_time="15 mins"
        )
        db.add(cupcake_recipe)
        
        # Ingredients for cupcakes
        cupcake_ingredients = [
            Ingredient(name="All-Purpose Flour", quantity="1.25 cups", recipe_id=cupcake_recipe.id),
            Ingredient(name="Baking Powder", quantity="1.25 tsp", recipe_id=cupcake_recipe.id),
            Ingredient(name="Salt", quantity="1/4 tsp", recipe_id=cupcake_recipe.id),
            Ingredient(name="Unsalted Butter (softened)", quantity="1/2 cup", recipe_id=cupcake_recipe.id),
            Ingredient(name="Sugar", quantity="3/4 cup", recipe_id=cupcake_recipe.id),
            Ingredient(name="Eggs", quantity="2", recipe_id=cupcake_recipe.id),
            Ingredient(name="Vanilla Extract", quantity="1.5 tsp", recipe_id=cupcake_recipe.id),
            Ingredient(name="Milk", quantity="1/2 cup", recipe_id=cupcake_recipe.id)
        ]
        for ing in cupcake_ingredients:
            db.add(ing)
            
        # Instructions for cupcakes
        cupcake_instructions = [
            Instruction(step_number=1, description="Preheat oven to 350°F (175°C) and line a muffin tin with cupcake liners.", recipe_id=cupcake_recipe.id),
            Instruction(step_number=2, description="Whisk flour, baking powder, and salt in a medium bowl.", recipe_id=cupcake_recipe.id),
            Instruction(step_number=3, description="Beat butter and sugar together until light and fluffy.", recipe_id=cupcake_recipe.id),
            Instruction(step_number=4, description="Add eggs one at a time, then stir in the vanilla extract.", recipe_id=cupcake_recipe.id),
            Instruction(step_number=5, description="Alternate adding the flour mixture and milk, mixing until smooth.", recipe_id=cupcake_recipe.id),
            Instruction(step_number=6, description="Spoon batter into liners and bake for 15 minutes.", recipe_id=cupcake_recipe.id),
            Instruction(step_number=7, description="Let cool completely, then frost and decorate with colorful sprinkles!", recipe_id=cupcake_recipe.id)
        ]
        for inst in cupcake_instructions:
            db.add(inst)

        # Seed Banana Bread
        bread_recipe = Recipe(
            id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
            name="Easy Banana Bread",
            description="Use up those ripe bananas to make a sweet, delicious bread. Super simple!",
            image_url="https://lh3.googleusercontent.com/aida-public/AB6AXuA03ItF3Rf5zfPf0s-jOe89zN_tGdVfEMfXCii5RGWTSLPt4mbXbGmZc_rzFU3cL6rV4q3cnOKk78NvPljFQ1krbWMLi1Nh-iHI6zVQbt-ID2_NGGmU3rfLNPWqHo-tT9sllz7wYlkxwRtKMEAcoub0-USpNTIDnEaUeqq6D-f12J7w5Qwu3NwSHGkueCMJJxW-TYu8ydWVDrUsz1ip3HderaTm0y9n0UtOP7-XtRRr8upzfG2JWPHwVjGoxsWXm1tQ2-on2hL2PVo",
            difficulty="Super Easy",
            prep_time="10 mins",
            cook_time="45 mins"
        )
        db.add(bread_recipe)
        
        # Ingredients for banana bread
        bread_ingredients = [
            Ingredient(name="Ripe Bananas (mashed)", quantity="3", recipe_id=bread_recipe.id),
            Ingredient(name="Melted Butter", quantity="1/3 cup", recipe_id=bread_recipe.id),
            Ingredient(name="Sugar", quantity="3/4 cup", recipe_id=bread_recipe.id),
            Ingredient(name="Egg (beaten)", quantity="1", recipe_id=bread_recipe.id),
            Ingredient(name="Vanilla Extract", quantity="1 tsp", recipe_id=bread_recipe.id),
            Ingredient(name="Baking Soda", quantity="1 tsp", recipe_id=bread_recipe.id),
            Ingredient(name="Salt", quantity="Pinch", recipe_id=bread_recipe.id),
            Ingredient(name="All-Purpose Flour", quantity="1.5 cups", recipe_id=bread_recipe.id)
        ]
        for ing in bread_ingredients:
            db.add(ing)
            
        # Instructions for banana bread
        bread_instructions = [
            Instruction(step_number=1, description="Preheat oven to 350°F (175°C) and grease a loaf pan.", recipe_id=bread_recipe.id),
            Instruction(step_number=2, description="In a large bowl, mash the ripe bananas with a fork until smooth.", recipe_id=bread_recipe.id),
            Instruction(step_number=3, description="Stir the melted butter into the mashed bananas.", recipe_id=bread_recipe.id),
            Instruction(step_number=4, description="Mix in the sugar, beaten egg, and vanilla extract.", recipe_id=bread_recipe.id),
            Instruction(step_number=5, description="Sprinkle baking soda and salt over the mixture and stir in.", recipe_id=bread_recipe.id),
            Instruction(step_number=6, description="Add the flour last and mix gently until just combined.", recipe_id=bread_recipe.id),
            Instruction(step_number=7, description="Pour batter into the loaf pan and bake for 45 minutes. Let cool before slicing.", recipe_id=bread_recipe.id)
        ]
        for inst in bread_instructions:
            db.add(inst)

        db.commit()
    finally:
        db.close()

seed_db()
