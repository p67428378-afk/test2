from fastapi import FastAPI
from server.api.v1.endpoints import mealplans, shoppinglists, users, recipes
from server.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(mealplans.router, prefix="/api/v1/mealplans", tags=["mealplans"])
app.include_router(shoppinglists.router, prefix="/api/v1/shoppinglists", tags=["shoppinglists"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(recipes.router, prefix="/api/v1/recipes", tags=["recipes"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Meal Plan Chatbot API"}
