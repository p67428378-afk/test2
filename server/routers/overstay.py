from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import ParkingAllocation, QRToken
from server.schemas import OverstayResponseItem

router = APIRouter(prefix="/api/v1/visitors/overstay", tags=["overstay-parking"])


@router.get("/active", response_model=List[OverstayResponseItem])
def get_active_overstays(db: Session = Depends(get_db)):
    now = datetime.utcnow()
    results: List[OverstayResponseItem] = []

    # 1. Query parking allocations where actual_exit_time is None
    allocations = (
        db.query(ParkingAllocation)
        .filter(ParkingAllocation.actual_exit_time.is_(None))
        .all()
    )

    for alloc in allocations:
        visitor_name = (
            str(alloc.visitor.visitor_name) if alloc.visitor else "Unknown Visitor"
        )
        entry_time = alloc.entry_time
        expected_exit_time = alloc.expected_exit_time
        grace_expires = expected_exit_time + timedelta(minutes=30)

        is_overstay = now > grace_expires
        status_label = "Overstay Detected" if is_overstay else "Normal"

        if is_overstay and not alloc.overstay_flag:
            alloc.overstay_flag = True
            db.commit()

        results.append(
            OverstayResponseItem(
                visitor_id=str(alloc.visitor_id),
                visitor_name=visitor_name,
                vehicle_number=str(alloc.vehicle_number)
                if alloc.vehicle_number
                else None,
                slot_number=str(alloc.slot_number) if alloc.slot_number else None,
                entry_time=entry_time,
                expected_exit_time=expected_exit_time,
                grace_period_expires=grace_expires,
                overstay_status=status_label,
            )
        )

    # 2. Also check visitors who have used QRToken entry timestamps but no exit timestamp
    tokens = (
        db.query(QRToken)
        .filter(
            QRToken.entry_timestamp.isnot(None),
            QRToken.exit_timestamp.is_(None),
            QRToken.visitor_id.isnot(None),
        )
        .all()
    )

    existing_visitor_ids = {r.visitor_id for r in results}

    for token in tokens:
        if str(token.visitor_id) in existing_visitor_ids:
            continue
        visitor = token.visitor
        if not visitor:
            continue

        entry_time = token.entry_timestamp or visitor.expected_arrival
        expected_exit_time = visitor.expected_departure
        grace_expires = expected_exit_time + timedelta(minutes=30)

        is_overstay = now > grace_expires
        status_label = "Overstay Detected" if is_overstay else "Normal"

        results.append(
            OverstayResponseItem(
                visitor_id=str(visitor.id),
                visitor_name=str(visitor.visitor_name),
                vehicle_number=str(visitor.vehicle_number)
                if visitor.vehicle_number
                else None,
                slot_number=str(visitor.assigned_parking_slot)
                if visitor.assigned_parking_slot
                else None,
                entry_time=entry_time,
                expected_exit_time=expected_exit_time,
                grace_period_expires=grace_expires,
                overstay_status=status_label,
            )
        )

    return results
