from fastapi import APIRouter, Query
from datetime import datetime, timezone
from typing import Optional
from zoneinfo import ZoneInfo
from server.schemas import ServerTime

router = APIRouter()


@router.get("/time", response_model=ServerTime)
def get_server_time(
    tz: Optional[str] = Query(
        None, description="Target timezone name e.g. America/New_York"
    ),
):
    now_utc = datetime.now(timezone.utc)
    utc_datetime_str = now_utc.isoformat()
    timestamp_ms = int(now_utc.timestamp() * 1000)

    local_datetime_str = None
    target_tz_str = "UTC"

    if tz:
        try:
            target_zone = ZoneInfo(tz)
            now_local = now_utc.astimezone(target_zone)
            local_datetime_str = now_local.isoformat()
            target_tz_str = tz
        except Exception:
            local_datetime_str = utc_datetime_str

    return ServerTime(
        utc_datetime=utc_datetime_str,
        timezone=target_tz_str,
        timestamp_ms=timestamp_ms,
        local_datetime=local_datetime_str,
    )
