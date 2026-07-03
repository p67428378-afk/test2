import random
from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import SolarSystem, EnergyData, User, Alert, ServiceRequest
from server.schemas import (
    RealtimeEnergyResponse,
    AnalyticsResponse,
    GenerationDataPoint,
    UsageBreakdown,
)
from server.auth import get_current_user

router = APIRouter()


def check_and_trigger_alerts(system: SolarSystem, current_power_kw: float, db: Session):
    """
    Automated Maintenance Alerts:
    Alert is triggered if a panel's output drops by more than 25%.
    Service request is automatically created when a critical maintenance alert is triggered.
    """
    # Let's assume standard expected output is 6.0 kW
    expected_output = 6.0
    if expected_output > 0:
        drop_pct = ((expected_output - current_power_kw) / expected_output) * 100
        if drop_pct > 25.0:
            severity = "Critical" if drop_pct > 35.0 else "Medium"
            description = f"System output dropped by {drop_pct:.1f}% (Threshold: 25%). Current: {current_power_kw} kW, Expected: {expected_output} kW"

            # Create alert
            alert = Alert(
                system_id=system.id,
                severity=severity,
                description=description,
                is_resolved=False,
            )
            db.add(alert)
            db.commit()
            db.refresh(alert)

            # Automatically create service request for critical alerts
            if severity == "Critical":
                service_req = ServiceRequest(
                    alert_id=alert.id,
                    status="New",
                    notes=f"Automated service request created for critical alert: {description}",
                )
                db.add(service_req)
                db.commit()


@router.get("/systems/{system_id}/realtime", response_model=RealtimeEnergyResponse)
def get_realtime_data(
    system_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    system = db.query(SolarSystem).filter(SolarSystem.id == system_id).first()
    if not system:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="System not found"
        )

    # Check ownership (unless technician)
    if current_user.role != "technician" and system.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this system",
        )

    # Get latest energy data or generate mock if none exists
    latest_data = (
        db.query(EnergyData)
        .filter(EnergyData.system_id == system_id)
        .order_by(EnergyData.recorded_at.desc())
        .first()
    )

    if latest_data:
        # Run automated alert check
        check_and_trigger_alerts(system, float(latest_data.current_power_kw), db)

        return {
            "system_id": system.id,
            "current_power_kw": float(latest_data.current_power_kw),
            "efficiency_pct": float(latest_data.efficiency_pct),
            "today_generation_kwh": float(latest_data.today_generation_kwh),
            "status": system.status,
            "updated_at": latest_data.recorded_at,
        }
    else:
        # Return default mock data and check alerts
        mock_power = 3.2  # >25% drop from 6.0 kW to trigger alert
        check_and_trigger_alerts(system, mock_power, db)

        return {
            "system_id": system.id,
            "current_power_kw": mock_power,
            "efficiency_pct": 75.0,
            "today_generation_kwh": 12.5,
            "status": system.status,
            "updated_at": datetime.utcnow(),
        }


@router.get("/systems/{system_id}/analytics", response_model=AnalyticsResponse)
def get_analytics(
    system_id: UUID,
    period: str = "monthly",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    system = db.query(SolarSystem).filter(SolarSystem.id == system_id).first()
    if not system:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="System not found"
        )

    if current_user.role != "technician" and system.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this system",
        )

    # Query actual historical energy data if available
    historical_records = (
        db.query(EnergyData)
        .filter(EnergyData.system_id == system_id)
        .order_by(EnergyData.recorded_at.asc())
        .all()
    )

    generation_data = []
    if historical_records:
        for record in historical_records:
            date_str = record.recorded_at.strftime("%Y-%m-%d")
            generation_data.append(
                GenerationDataPoint(
                    date=date_str, kwh=float(record.today_generation_kwh)
                )
            )
    else:
        # Generate mock analytics based on period
        if period == "daily":
            for hour in range(6, 19):
                generation_data.append(
                    GenerationDataPoint(
                        date=f"{hour:02d}:00", kwh=round(random.uniform(0.5, 3.5), 2)
                    )
                )
        elif period == "weekly":
            days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            for day in days:
                generation_data.append(
                    GenerationDataPoint(
                        date=day, kwh=round(random.uniform(15.0, 25.0), 2)
                    )
                )
        else:  # monthly
            for day in range(1, 31, 3):
                generation_data.append(
                    GenerationDataPoint(
                        date=f"2026-06-{day:02d}",
                        kwh=round(random.uniform(18.0, 28.0), 2),
                    )
                )

    usage_breakdown = UsageBreakdown(
        battery_storage_kwh=120.5, grid_export_kwh=340.2, household_kwh=210.3
    )

    return {
        "system_id": system.id,
        "period": period,
        "generation_data": generation_data,
        "usage_breakdown": usage_breakdown,
    }
