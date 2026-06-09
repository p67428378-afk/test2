from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from decimal import Decimal
from datetime import datetime, timedelta
from fastapi import HTTPException
from server import models, schemas

# --- Customer CRUD ---
def get_customer(db: Session, customer_id: UUID):
    return db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 20):
    query = db.query(models.Customer)
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(
        name=customer.name,
        contact_info=customer.contact_info
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


# --- Product CRUD ---
def get_product(db: Session, product_id: UUID):
    return db.query(models.Product).filter(models.Product.product_id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 20):
    query = db.query(models.Product)
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        description=product.description,
        cost=product.cost,
        price=product.price,
        stock_quantity=product.stock_quantity
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: UUID, product_update: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: UUID):
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True


# --- Order / Quote CRUD ---
def get_quote(db: Session, quote_id: UUID):
    return db.query(models.Quote).filter(models.Quote.quote_id == quote_id).first()

def get_order(db: Session, order_id: UUID):
    return db.query(models.Order).filter(models.Order.order_id == order_id).first()

def get_orders_and_quotes(db: Session, skip: int = 0, limit: int = 20, status: str = None):
    # We need to return a paginated list of both quotes and orders, or filter by status.
    # Let's fetch orders first, then quotes, or combine them.
    # Wait, let's fetch all orders and quotes, and return them as a unified list.
    # To make it simple and robust, let's query orders and quotes separately and merge them, or query orders.
    # Wait, the API contract says: "Retrieve a paginated list of quotes and orders."
    # Let's query both and sort by created_at desc.
    orders_query = db.query(models.Order)
    quotes_query = db.query(models.Quote)
    
    if status:
        orders_query = orders_query.filter(models.Order.status == status)
        quotes_query = quotes_query.filter(models.Quote.status == status)
        
    orders = orders_query.all()
    quotes = quotes_query.all()
    
    # Map to unified response objects
    combined = []
    for o in orders:
        # Fetch customer name
        cust = db.query(models.Customer).filter(models.Customer.customer_id == o.customer_id).first()
        cust_name = cust.name if cust else "Unknown"
        
        # Map line items to include product details
        line_items_detailed = []
        for item in o.line_items:
            p_id = UUID(item["product_id"]) if isinstance(item["product_id"], str) else item["product_id"]
            prod = get_product(db, p_id)
            line_items_detailed.append({
                "product_id": p_id,
                "quantity": item["quantity"],
                "custom_price": item.get("custom_price"),
                "height": item.get("height"),
                "width": item.get("width"),
                "name": prod.name if prod else "Unknown Product",
                "price": prod.price if prod else Decimal("0.00")
            })
            
        combined.append(schemas.OrderResponse(
            order_id=o.order_id,
            quote_id=o.quote_id,
            customer_id=o.customer_id,
            customer_name=cust_name,
            status=o.status,
            line_items=line_items_detailed,
            total_price=o.total_price,
            created_at=o.created_at,
            updated_at=o.updated_at
        ))
        
    for q in quotes:
        # If this quote is already converted to an order, we can skip it or include it.
        # Let's include it if it's not converted, or always include it.
        # Wait, if it has an associated order, let's still include it as a quote.
        cust = db.query(models.Customer).filter(models.Customer.customer_id == q.customer_id).first()
        cust_name = cust.name if cust else "Unknown"
        
        line_items_detailed = []
        for item in q.line_items:
            p_id = UUID(item["product_id"]) if isinstance(item["product_id"], str) else item["product_id"]
            prod = get_product(db, p_id)
            line_items_detailed.append({
                "product_id": p_id,
                "quantity": item["quantity"],
                "custom_price": item.get("custom_price"),
                "height": item.get("height"),
                "width": item.get("width"),
                "name": prod.name if prod else "Unknown Product",
                "price": prod.price if prod else Decimal("0.00")
            })
            
        combined.append(schemas.OrderResponse(
            quote_id=q.quote_id,
            customer_id=q.customer_id,
            customer_name=cust_name,
            status=q.status,
            line_items=line_items_detailed,
            total_price=q.total_price,
            created_at=q.created_at,
            updated_at=q.updated_at
        ))
        
    # Sort combined by created_at desc
    combined.sort(key=lambda x: x.created_at, reverse=True)
    
    total = len(combined)
    paginated = combined[skip : skip + limit]
    return paginated, total

def create_order_or_quote(db: Session, order_in: schemas.OrderCreate):
    # Verify customer exists
    customer = get_customer(db, order_in.customer_id)
    if not customer:
        raise HTTPException(status_code=400, detail="Customer not found")
        
    # Calculate total price and verify stock if it's an order
    total_price = Decimal("0.00")
    line_items_data = []
    
    for item in order_in.line_items:
        product = get_product(db, item.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
            
        # Check stock if it's an order (not a quote)
        if not order_in.is_quote:
            if product.stock_quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for product {product.name}")
            # Decrement stock
            product.stock_quantity -= item.quantity
            
        price_to_use = item.custom_price if item.custom_price is not None else product.price
        item_total = price_to_use * item.quantity
        total_price += item_total
        
        line_items_data.append({
            "product_id": str(item.product_id),
            "quantity": item.quantity,
            "custom_price": float(item.custom_price) if item.custom_price is not None else None,
            "height": item.height,
            "width": item.width
        })
        
    if order_in.discount is not None:
        total_price = max(Decimal("0.00"), total_price - order_in.discount)
        
    if order_in.is_quote:
        db_quote = models.Quote(
            customer_id=order_in.customer_id,
            status="draft",
            line_items=line_items_data,
            total_price=total_price
        )
        db.add(db_quote)
        db.commit()
        db.refresh(db_quote)
        
        # Return mapped response
        return schemas.OrderResponse(
            quote_id=db_quote.quote_id,
            customer_id=db_quote.customer_id,
            customer_name=customer.name,
            status=db_quote.status,
            line_items=[
                schemas.LineItemResponse(
                    product_id=UUID(li["product_id"]),
                    quantity=li["quantity"],
                    custom_price=Decimal(str(li["custom_price"])) if li["custom_price"] is not None else None,
                    height=li["height"],
                    width=li["width"],
                    name=get_product(db, UUID(li["product_id"])).name,
                    price=get_product(db, UUID(li["product_id"])).price
                ) for li in db_quote.line_items
            ],
            total_price=db_quote.total_price,
            created_at=db_quote.created_at,
            updated_at=db_quote.updated_at
        )
    else:
        db_order = models.Order(
            customer_id=order_in.customer_id,
            status="pending",
            line_items=line_items_data,
            total_price=total_price
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        
        return schemas.OrderResponse(
            order_id=db_order.order_id,
            customer_id=db_order.customer_id,
            customer_name=customer.name,
            status=db_order.status,
            line_items=[
                schemas.LineItemResponse(
                    product_id=UUID(li["product_id"]),
                    quantity=li["quantity"],
                    custom_price=Decimal(str(li["custom_price"])) if li["custom_price"] is not None else None,
                    height=li["height"],
                    width=li["width"],
                    name=get_product(db, UUID(li["product_id"])).name,
                    price=get_product(db, UUID(li["product_id"])).price
                ) for li in db_order.line_items
            ],
            total_price=db_order.total_price,
            created_at=db_order.created_at,
            updated_at=db_order.updated_at
        )

def update_order_or_quote(db: Session, id_val: UUID, update_in: schemas.OrderUpdate):
    # Check if it's an Order
    db_order = get_order(db, id_val)
    if db_order:
        customer = get_customer(db, db_order.customer_id)
        if update_in.status is not None:
            db_order.status = update_in.status
        if update_in.total_price is not None:
            db_order.total_price = update_in.total_price
        if update_in.line_items is not None:
            # Update line items and adjust stock if needed
            # For simplicity, let's just update the line items JSON
            line_items_data = []
            for item in update_in.line_items:
                line_items_data.append({
                    "product_id": str(item.product_id),
                    "quantity": item.quantity,
                    "custom_price": float(item.custom_price) if item.custom_price is not None else None,
                    "height": item.height,
                    "width": item.width
                })
            db_order.line_items = line_items_data
            
        db_order.updated_at = func.now()
        db.commit()
        db.refresh(db_order)
        
        return schemas.OrderResponse(
            order_id=db_order.order_id,
            quote_id=db_order.quote_id,
            customer_id=db_order.customer_id,
            customer_name=customer.name if customer else "Unknown",
            status=db_order.status,
            line_items=[
                schemas.LineItemResponse(
                    product_id=UUID(li["product_id"]),
                    quantity=li["quantity"],
                    custom_price=Decimal(str(li["custom_price"])) if li["custom_price"] is not None else None,
                    height=li["height"],
                    width=li["width"],
                    name=get_product(db, UUID(li["product_id"])).name if get_product(db, UUID(li["product_id"])) else "Unknown",
                    price=get_product(db, UUID(li["product_id"])).price if get_product(db, UUID(li["product_id"])) else Decimal("0.00")
                ) for li in db_order.line_items
            ],
            total_price=db_order.total_price,
            created_at=db_order.created_at,
            updated_at=db_order.updated_at
        )
        
    # Check if it's a Quote
    db_quote = get_quote(db, id_val)
    if db_quote:
        customer = get_customer(db, db_quote.customer_id)
        if update_in.status is not None:
            db_quote.status = update_in.status
            # If status is updated to "ordered", let's automatically convert it to an Order!
            if update_in.status.lower() == "ordered":
                # Check if order already exists for this quote
                existing_order = db.query(models.Order).filter(models.Order.quote_id == db_quote.quote_id).first()
                if not existing_order:
                    # Create order
                    # Verify stock first
                    for item in db_quote.line_items:
                        p_id = UUID(item["product_id"])
                        product = get_product(db, p_id)
                        if product and product.stock_quantity < item["quantity"]:
                            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {product.name} to convert quote to order")
                        if product:
                            product.stock_quantity -= item["quantity"]
                            
                    db_order = models.Order(
                        quote_id=db_quote.quote_id,
                        customer_id=db_quote.customer_id,
                        status="pending",
                        line_items=db_quote.line_items,
                        total_price=db_quote.total_price
                    )
                    db.add(db_order)
                    db.commit()
                    db.refresh(db_order)
                    
                    return schemas.OrderResponse(
                        order_id=db_order.order_id,
                        quote_id=db_order.quote_id,
                        customer_id=db_order.customer_id,
                        customer_name=customer.name if customer else "Unknown",
                        status=db_order.status,
                        line_items=[
                            schemas.LineItemResponse(
                                product_id=UUID(li["product_id"]),
                                quantity=li["quantity"],
                                custom_price=Decimal(str(li["custom_price"])) if li["custom_price"] is not None else None,
                                height=li["height"],
                                width=li["width"],
                                name=get_product(db, UUID(li["product_id"])).name if get_product(db, UUID(li["product_id"])) else "Unknown",
                                price=get_product(db, UUID(li["product_id"])).price if get_product(db, UUID(li["product_id"])) else Decimal("0.00")
                            ) for li in db_order.line_items
                        ],
                        total_price=db_order.total_price,
                        created_at=db_order.created_at,
                        updated_at=db_order.updated_at
                    )
                    
        if update_in.total_price is not None:
            db_quote.total_price = update_in.total_price
        if update_in.line_items is not None:
            line_items_data = []
            for item in update_in.line_items:
                line_items_data.append({
                    "product_id": str(item.product_id),
                    "quantity": item.quantity,
                    "custom_price": float(item.custom_price) if item.custom_price is not None else None,
                    "height": item.height,
                    "width": item.width
                })
            db_quote.line_items = line_items_data
            
        db_quote.updated_at = func.now()
        db.commit()
        db.refresh(db_quote)
        
        return schemas.OrderResponse(
            quote_id=db_quote.quote_id,
            customer_id=db_quote.customer_id,
            customer_name=customer.name if customer else "Unknown",
            status=db_quote.status,
            line_items=[
                schemas.LineItemResponse(
                    product_id=UUID(li["product_id"]),
                    quantity=li["quantity"],
                    custom_price=Decimal(str(li["custom_price"])) if li["custom_price"] is not None else None,
                    height=li["height"],
                    width=li["width"],
                    name=get_product(db, UUID(li["product_id"])).name if get_product(db, UUID(li["product_id"])) else "Unknown",
                    price=get_product(db, UUID(li["product_id"])).price if get_product(db, UUID(li["product_id"])) else Decimal("0.00")
                ) for li in db_quote.line_items
            ],
            total_price=db_quote.total_price,
            created_at=db_quote.created_at,
            updated_at=db_quote.updated_at
        )
        
    return None


# --- Report Metrics ---
def get_report_metrics(db: Session, period: str = "30d"):
    # Active orders count (status not in ['completed', 'cancelled'])
    active_orders_count = db.query(models.Order).filter(
        models.Order.status.notin_(["completed", "cancelled"])
    ).count()
    
    # Low stock count (stock_quantity < 10)
    low_stock_count = db.query(models.Product).filter(
        models.Product.stock_quantity < 10
    ).count()
    
    # Total revenue (sum of total_price of completed orders)
    total_revenue_res = db.query(func.sum(models.Order.total_price)).filter(
        models.Order.status == "completed"
    ).scalar()
    total_revenue = Decimal(str(total_revenue_res)) if total_revenue_res is not None else Decimal("0.00")
    
    # Sales history (grouped by date)
    # Let's generate some mock or real sales history based on completed orders
    # For SQLite, we can group by strftime or just parse dates in Python
    orders = db.query(models.Order).filter(models.Order.status == "completed").all()
    
    history_dict = {}
    # Initialize last 7 days or similar if empty, or just group existing
    for o in orders:
        date_str = o.created_at.strftime("%Y-%m-%d") if o.created_at else datetime.utcnow().strftime("%Y-%m-%d")
        history_dict[date_str] = history_dict.get(date_str, Decimal("0.00")) + o.total_price
        
    # If history is empty, let's add today with 0
    if not history_dict:
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        history_dict[today_str] = Decimal("0.00")
        
    sales_history = [
        schemas.SalesHistoryItem(date=d, revenue=r)
        for d, r in sorted(history_dict.items())
    ]
    
    return schemas.ReportResponse(
        active_orders_count=active_orders_count,
        low_stock_count=low_stock_count,
        sales_history=sales_history,
        total_revenue=total_revenue
    )
