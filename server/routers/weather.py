from fastapi import APIRouter, HTTPException, Query, status
from server import schemas

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/alerts", response_model=schemas.WeatherAlertsResponse)
def get_weather_alerts(
    latitude: float = Query(..., description="Latitude of the location"),
    longitude: float = Query(..., description="Longitude of the location"),
):
    # Validate coordinates
    if not (-90.0 <= latitude <= 90.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Latitude must be between -90 and 90",
        )
    if not (-180.0 <= longitude <= 180.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Longitude must be between -180 and 180",
        )

    # Generate mock alerts based on coordinates
    alerts = []

    # Example: Sector 4-North (approximate coordinates)
    if 20.0 <= latitude <= 30.0 and -85.0 <= longitude <= -70.0:
        alerts.append(
            schemas.WeatherAlert(
                message="AMBER ALERT: Gale warning in Sector 4-North. Expected wave heights 4-5m.",
                severity="amber",
                source="National Weather Service",
            )
        )
    elif latitude > 50.0 or latitude < -50.0:
        alerts.append(
            schemas.WeatherAlert(
                message="RED ALERT: High wind and freezing spray warning.",
                severity="red",
                source="Polar Weather Center",
            )
        )
    else:
        alerts.append(
            schemas.WeatherAlert(
                message="GREEN: Clear skies and calm seas.",
                severity="green",
                source="Marine Weather Service",
            )
        )

    return schemas.WeatherAlertsResponse(alerts=alerts)
