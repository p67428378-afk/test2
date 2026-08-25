from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List
import logging

from server.database import get_db
from server.models import Inventory, Item, Warehouse, StockAdjustment
from server.schemas import (
    InventoryUpdate,
    InventoryResponse,
    LowStockAlertResponse,
    StockAdjustmentCreate,
    StockAdjustmentResponse,
    StockTransferCreate,
)
from server.api.v1.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/inventory", tags=["inventory"])

# Roles allowed to adjust stock
staff_or_above = RoleChecker(["admin", "manager", "staff"])

logger = logging.getLogger(__name__)


def dispatch_low_stock_notification(
    item: Item, warehouse: Warehouse, current_stock: int
):
    # AC: Automatically generate alerts when stock levels fall below specified reorder thresholds
    # In a real system, this would send an email, SMS, or webhook.
    # Here we log it and print it so it's visible in the test/server logs.
    alert_msg = f"[NOTIFICATION] ALERT: Item {item.sku} ({item.name}) in {warehouse.name} has fallen below reorder threshold! Current stock: {current_stock}, Threshold: {item.reorder_threshold}"
    print(alert_msg)
    logger.warning(alert_msg)


@router.get("", response_model=List[InventoryResponse])
def list_inventory(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # AC: The system shall maintain real-time visibility into current stock quantities across all inventory items and warehouses
    return (
        db.query(Inventory)
        .order_by(Inventory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/low-stock", response_model=List[LowStockAlertResponse])
def get_low_stock_items(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    # Eager load item and warehouse to avoid N+1 queries
    records = (
        db.query(Inventory)
        .options(joinedload(Inventory.item), joinedload(Inventory.warehouse))
        .all()
    )

    low_stock_alerts = []
    for rec in records:
        if rec.current_stock < rec.item.reorder_threshold:
            low_stock_alerts.append(
                {
                    "sku": rec.item.sku,
                    "name": rec.item.name,
                    "warehouse": rec.warehouse.name,
                    "current_stock": rec.current_stock,
                    "threshold": rec.item.reorder_threshold,
                    "status": "Low Stock",
                }
            )

    return low_stock_alerts


@router.put("/{item_id}", response_model=InventoryResponse)
def update_stock_level(
    item_id: str,
    inv_update: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(staff_or_above),
):
    # Verify item and warehouse exist
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    warehouse = (
        db.query(Warehouse).filter(Warehouse.id == inv_update.warehouse_id).first()
    )
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    try:
        # Find or create inventory record
        inv_record = (
            db.query(Inventory)
            .filter(
                Inventory.item_id == item_id,
                Inventory.warehouse_id == inv_update.warehouse_id,
            )
            .first()
        )

        old_stock = 0
        if inv_record:
            old_stock = inv_record.current_stock
            inv_record.current_stock = inv_update.current_stock
        else:
            inv_record = Inventory(
                item_id=item_id,
                warehouse_id=inv_update.warehouse_id,
                current_stock=inv_update.current_stock,
            )
            db.add(inv_record)

        # Log stock adjustment automatically
        change = inv_update.current_stock - old_stock
        if change != 0:
            adj_type = "addition" if change > 0 else "reduction"
            adjustment = StockAdjustment(
                item_id=item_id,
                warehouse_id=inv_update.warehouse_id,
                user_id=current_user.id,
                adjustment_type=adj_type,
                quantity=abs(change),
                reason_code="RECONCILIATION",
                notes=f"Direct stock update from {old_stock} to {inv_update.current_stock}",
            )
            db.add(adjustment)

        db.commit()
        db.refresh(inv_record)

        # Check for low stock alert
        if inv_record.current_stock < item.reorder_threshold:
            dispatch_low_stock_notification(item, warehouse, inv_record.current_stock)

        return inv_record

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post(
    "/{item_id}/adjust",
    response_model=StockAdjustmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def record_stock_adjustment(
    item_id: str,
    adj_in: StockAdjustmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(staff_or_above),
):
    # Verify item and warehouse exist
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    warehouse = db.query(Warehouse).filter(Warehouse.id == adj_in.warehouse_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    if adj_in.adjustment_type not in ["addition", "reduction"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid adjustment type. Must be 'addition' or 'reduction'.",
        )

    if adj_in.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0.")

    try:
        # Find or create inventory record
        inv_record = (
            db.query(Inventory)
            .filter(
                Inventory.item_id == item_id,
                Inventory.warehouse_id == adj_in.warehouse_id,
            )
            .first()
        )

        if not inv_record:
            inv_record = Inventory(
                item_id=item_id, warehouse_id=adj_in.warehouse_id, current_stock=0
            )
            db.add(inv_record)

        # Apply adjustment
        if adj_in.adjustment_type == "addition":
            inv_record.current_stock += adj_in.quantity
        elif adj_in.adjustment_type == "reduction":
            if inv_record.current_stock < adj_in.quantity:
                raise HTTPException(
                    status_code=400, detail="Insufficient stock for reduction."
                )
            inv_record.current_stock -= adj_in.quantity

        # Create adjustment record
        adjustment = StockAdjustment(
            item_id=item_id,
            warehouse_id=adj_in.warehouse_id,
            user_id=current_user.id,
            adjustment_type=adj_in.adjustment_type,
            quantity=adj_in.quantity,
            reason_code=adj_in.reason_code,
            notes=adj_in.notes,
        )
        db.add(adjustment)

        db.commit()
        db.refresh(adjustment)

        # Check for low stock alert
        if inv_record.current_stock < item.reorder_threshold:
            dispatch_low_stock_notification(item, warehouse, inv_record.current_stock)

        return adjustment

    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/{item_id}/transfer", status_code=status.HTTP_201_CREATED)
def transfer_stock(
    item_id: str,
    transfer_in: StockTransferCreate,
    db: Session = Depends(get_db),
    current_user=Depends(staff_or_above),
):
    # AC: Log all manual stock adjustments, transfers, and inventory reconciliations
    if transfer_in.source_warehouse_id == transfer_in.destination_warehouse_id:
        raise HTTPException(
            status_code=400,
            detail="Source and destination warehouses must be different.",
        )

    if transfer_in.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0.")

    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    src_wh = (
        db.query(Warehouse)
        .filter(Warehouse.id == transfer_in.source_warehouse_id)
        .first()
    )
    dest_wh = (
        db.query(Warehouse)
        .filter(Warehouse.id == transfer_in.destination_warehouse_id)
        .first()
    )
    if not src_wh or not dest_wh:
        raise HTTPException(status_code=404, detail="One or both warehouses not found")

    try:
        # 1. Deduct from source warehouse
        src_inv = (
            db.query(Inventory)
            .filter(
                Inventory.item_id == item_id,
                Inventory.warehouse_id == transfer_in.source_warehouse_id,
            )
            .first()
        )

        if not src_inv or src_inv.current_stock < transfer_in.quantity:
            raise HTTPException(
                status_code=400, detail="Insufficient stock in source warehouse."
            )

        src_inv.current_stock -= transfer_in.quantity

        # 2. Add to destination warehouse
        dest_inv = (
            db.query(Inventory)
            .filter(
                Inventory.item_id == item_id,
                Inventory.warehouse_id == transfer_in.destination_warehouse_id,
            )
            .first()
        )

        if not dest_inv:
            dest_inv = Inventory(
                item_id=item_id,
                warehouse_id=transfer_in.destination_warehouse_id,
                current_stock=0,
            )
            db.add(dest_inv)

        dest_inv.current_stock += transfer_in.quantity

        # 3. Log reduction adjustment for source warehouse
        src_adj = StockAdjustment(
            item_id=item_id,
            warehouse_id=transfer_in.source_warehouse_id,
            user_id=current_user.id,
            adjustment_type="reduction",
            quantity=transfer_in.quantity,
            reason_code="TRANSFER_OUT",
            notes=f"Transferred to {dest_wh.name}. {transfer_in.notes or ''}",
        )
        db.add(src_adj)

        # 4. Log addition adjustment for destination warehouse
        dest_adj = StockAdjustment(
            item_id=item_id,
            warehouse_id=transfer_in.destination_warehouse_id,
            user_id=current_user.id,
            adjustment_type="addition",
            quantity=transfer_in.quantity,
            reason_code="TRANSFER_IN",
            notes=f"Transferred from {src_wh.name}. {transfer_in.notes or ''}",
        )
        db.add(dest_adj)

        db.commit()

        # Check for low stock alert on source warehouse
        if src_inv.current_stock < item.reorder_threshold:
            dispatch_low_stock_notification(item, src_wh, src_inv.current_stock)

        return {
            "message": f"Successfully transferred {transfer_in.quantity} units of {item.name} from {src_wh.name} to {dest_wh.name}.",
            "source_warehouse_stock": src_inv.current_stock,
            "destination_warehouse_stock": dest_inv.current_stock,
        }

    except HTTPException as he:
        db.rollback()
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/adjustments")
def list_adjustments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Eager load relationships to avoid N+1 queries
    adjustments = (
        db.query(StockAdjustment)
        .options(
            joinedload(StockAdjustment.item),
            joinedload(StockAdjustment.user),
            joinedload(StockAdjustment.warehouse),
        )
        .order_by(StockAdjustment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    results = []
    for adj in adjustments:
        change = adj.quantity if adj.adjustment_type == "addition" else -adj.quantity
        results.append(
            {
                "id": adj.id,
                "timestamp": adj.created_at,
                "user": adj.user.full_name,
                "sku": adj.item.sku,
                "item_name": adj.item.name,
                "warehouse": adj.warehouse.name,
                "change": change,
                "reason": adj.reason_code,
                "notes": adj.notes,
            }
        )

    return results
