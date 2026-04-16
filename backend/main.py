
from fastapi import FastAPI

from .database import engine, SessionLocal
from .models import Base, Product
from .api.endpoints import cart

app = FastAPI()

app.include_router(cart.router, prefix="/api/cart", tags=["cart"])

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    # Add some dummy products
    if not db.query(Product).first():
        db.add(Product(id=1, name="Sculptural Minimalist Lamp", price=185.00, stock=10))
        db.add(Product(id=2, name="Charcoal Vase", price=95.00, stock=0))
        db.commit()
    db.close()
