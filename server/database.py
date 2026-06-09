from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from server.core.config import settings
import datetime

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_db():
    from server import models
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if SKUs already exist
        if db.query(models.SKU).count() == 0:
            # Create SKUs
            sku1 = models.SKU(name="Clover Valley Potato Chips 10oz", description="Delicious potato chips", brand="Clover Valley", is_private_brand=True)
            sku2 = models.SKU(name="Brand A Tortilla Chips 12oz", description="Crispy tortilla chips", brand="Brand A", is_private_brand=False)
            sku3 = models.SKU(name="Brand B Cheese Puffs 8oz", description="Cheesy puffs", brand="Brand B", is_private_brand=False)
            sku4 = models.SKU(name="Clover Valley Pretzels 16oz", description="Salty pretzels", brand="Clover Valley", is_private_brand=True)
            sku5 = models.SKU(name="Brand C Popcorn 6oz", description="Buttery popcorn", brand="Brand C", is_private_brand=False)
            
            db.add_all([sku1, sku2, sku3, sku4, sku5])
            db.commit()
            
            # Create Store
            store = models.Store(name="Small Town Value Store 1", cluster="Small Town Value Cluster")
            db.add(store)
            db.commit()
            
            # Create Sales Data
            now = datetime.datetime.utcnow()
            sd1 = models.SalesData(sku_id=sku1.id, store_id=store.id, date=now, revenue=12450.0, profit=3112.0, volume=6225)
            sd2 = models.SalesData(sku_id=sku2.id, store_id=store.id, date=now, revenue=9800.0, profit=2450.0, volume=4900)
            sd3 = models.SalesData(sku_id=sku3.id, store_id=store.id, date=now, revenue=4200.0, profit=840.0, volume=2100)
            sd4 = models.SalesData(sku_id=sku4.id, store_id=store.id, date=now, revenue=8100.0, profit=2025.0, volume=4050)
            sd5 = models.SalesData(sku_id=sku5.id, store_id=store.id, date=now, revenue=2100.0, profit=315.0, volume=1050)
            
            db.add_all([sd1, sd2, sd3, sd4, sd5])
            db.commit()
            
        # Check if Scenarios exist
        if db.query(models.Scenario).count() == 0:
            sc1 = models.Scenario(name="Conservative", description="Minimize changes. Projected PB: 24.9%", projected_sales=1.2, projected_profit=1.5, projected_private_brand_pct=24.9)
            sc2 = models.Scenario(name="Balanced", description="Optimal mix of core & new. Projected PB: 25.5%", projected_sales=3.5, projected_profit=4.1, projected_private_brand_pct=25.5)
            sc3 = models.Scenario(name="Aggressive", description="Maximize new intros. Projected PB: 26.2%", projected_sales=5.8, projected_profit=6.2, projected_private_brand_pct=26.2)
            
            db.add_all([sc1, sc2, sc3])
            db.commit()
    finally:
        db.close()
