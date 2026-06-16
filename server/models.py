import uuid
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Numeric, Date, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from server.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    login_id = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    security_question = Column(String(255), nullable=False)
    security_answer_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    otps = relationship("OTP", back_populates="user")
    password_history = relationship("PasswordHistory", back_populates="user")

class OTP(Base):
    __tablename__ = "otps"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    otp_code_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="otps")

class PasswordHistory(Base):
    __tablename__ = "password_history"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    changed_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="password_history")


# --- Assortment Advisor Models ---

class Product(Base):
    __tablename__ = "products"
    sku = Column(String(50), primary_key=True, unique=True)
    name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    is_private_brand = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    sales = relationship("Sales", back_populates="product", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="product", cascade="all, delete-orphan")
    scenario_actions = relationship("ScenarioAction", back_populates="product", cascade="all, delete-orphan")

class Store(Base):
    __tablename__ = "stores"
    store_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    cluster = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    sales = relationship("Sales", back_populates="store", cascade="all, delete-orphan")
    inventory = relationship("Inventory", back_populates="store", cascade="all, delete-orphan")

class Sales(Base):
    __tablename__ = "sales"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(50), ForeignKey("products.sku"), nullable=False)
    store_id = Column(UUID(as_uuid=True), ForeignKey("stores.store_id"), nullable=False)
    date = Column(Date, nullable=False)
    units_sold = Column(Integer, nullable=False, default=0)
    price = Column(Numeric(10, 2), nullable=False, default=0.00)
    sales_amount = Column(Numeric(12, 2), nullable=False, default=0.00)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    product = relationship("Product", back_populates="sales")
    store = relationship("Store", back_populates="sales")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sku = Column(String(50), ForeignKey("products.sku"), nullable=False)
    store_id = Column(UUID(as_uuid=True), ForeignKey("stores.store_id"), nullable=False)
    stock_on_hand = Column(Integer, nullable=False, default=0)
    shelf_capacity = Column(Integer, nullable=False, default=0)
    in_stock_rate = Column(Numeric(5, 2), nullable=False, default=100.00)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    product = relationship("Product", back_populates="inventory")
    store = relationship("Store", back_populates="inventory")

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=False)
    projected_sales = Column(Numeric(10, 2), nullable=False, default=0.00)
    projected_pb_percentage = Column(Numeric(5, 2), nullable=False, default=0.00)
    projected_in_stock_rate = Column(Numeric(5, 2), nullable=False, default=0.00)
    projected_shelf_capacity = Column(Numeric(5, 2), nullable=False, default=0.00)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    sku_actions = relationship("ScenarioAction", back_populates="scenario", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="scenario", cascade="all, delete-orphan")

class ScenarioAction(Base):
    __tablename__ = "scenario_actions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    sku = Column(String(50), ForeignKey("products.sku"), nullable=False)
    action = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    scenario = relationship("Scenario", back_populates="sku_actions")
    product = relationship("Product", back_populates="scenario_actions")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    submitted_by = Column(String(255), nullable=False)
    submitted_at = Column(DateTime, default=func.now())
    audit_id = Column(String(100), nullable=False, unique=True)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    scenario = relationship("Scenario", back_populates="submissions")
