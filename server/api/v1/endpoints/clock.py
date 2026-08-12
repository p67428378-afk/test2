from fastapi import APIRouter, Query
from datetime import datetime, timezone
from typing import Optional
from zoneinfo import ZoneInfo
from server.schemas import ServerTime

router = APIRouter()


def _get_tzinfo(tz_str: str):
    # 1. Try standard library ZoneInfo
    try:
        return ZoneInfo(tz_str)
    except Exception:
        pass

    # 2. Try dateutil.tz fallback
    try:
        from dateutil import tz as dateutil_tz

        tz_obj = dateutil_tz.gettz(tz_str)
        if tz_obj is not None:
            return tz_obj
    except Exception:
        pass

    # 3. Try pytz fallback
    try:
        import pytz

        return pytz.timezone(tz_str)
    except Exception:
        pass

    return None


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
        target_zone = _get_tzinfo(tz)
        if target_zone is not None:
            try:
                now_local = now_utc.astimezone(target_zone)
                local_datetime_str = now_local.isoformat()
                target_tz_str = tz
            except Exception:
                local_datetime_str = utc_datetime_str
                target_tz_str = "UTC"
        else:
            local_datetime_str = utc_datetime_str
            target_tz_str = "UTC"

    return ServerTime(
        utc_datetime=utc_datetime_str,
        timezone=target_tz_str,
        timestamp_ms=timestamp_ms,
        local_datetime=local_datetime_str,
    )
