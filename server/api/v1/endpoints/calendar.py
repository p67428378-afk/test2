"""
Module: server.api.v1.endpoints.calendar
Purpose: API endpoints for calendar grid generation.
Author: Backend Developer Agent
Created: 2026-06-16
"""

import calendar
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/calendar/{year}/{month}", response_model=schemas.CalendarGridResponse)
def get_calendar_grid(year: int, month: int, db: Session = Depends(get_db)):
    """
    Retrieves calendar grid data for a specific month and year,
    including padding days from previous/next months to form a complete grid.
    """
    # Validate year and month
    if year < 1 or year > 9999:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid year. Year must be between 1 and 9999."
        )
    if month < 1 or month > 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid month. Month must be between 1 and 12."
        )

    try:
        # Log/record the requested month in the database
        crud.get_or_create_calendar_month(db, year, month)

        # Get today's date to highlight the current day
        today = datetime.date.today()

        # Find the first day of the month and its weekday (Monday=0, Sunday=6)
        first_day = datetime.date(year, month, 1)
        # Convert to Sunday=0, Monday=1, ..., Saturday=6
        first_day_weekday = (first_day.weekday() + 1) % 7

        # Get number of days in the current month
        _, days_in_month = calendar.monthrange(year, month)

        # Get previous month details
        if month == 1:
            prev_month = 12
            prev_year = year - 1
        else:
            prev_month = month - 1
            prev_year = year

        # Get number of days in the previous month
        if prev_year >= 1:
            _, days_in_prev_month = calendar.monthrange(prev_year, prev_month)
        else:
            days_in_prev_month = 31  # Fallback for year 0

        days = []

        # 1. Padding days from previous month
        if first_day_weekday > 0:
            start_day = days_in_prev_month - first_day_weekday + 1
            for d in range(start_day, days_in_prev_month + 1):
                if prev_year >= 1:
                    date_str = f"{prev_year:04d}-{prev_month:02d}-{d:02d}"
                    is_today = (prev_year == today.year and prev_month == today.month and d == today.day)
                else:
                    date_str = f"0000-{prev_month:02d}-{d:02d}"
                    is_today = False
                days.append(
                    schemas.CalendarDayResponse(
                        date=date_str,
                        day_number=d,
                        is_current_month=False,
                        is_today=is_today
                    )
                )

        # 2. Days of the current month
        for d in range(1, days_in_month + 1):
            date_str = f"{year:04d}-{month:02d}-{d:02d}"
            is_today = (year == today.year and month == today.month and d == today.day)
            days.append(
                schemas.CalendarDayResponse(
                    date=date_str,
                    day_number=d,
                    is_current_month=True,
                    is_today=is_today
                )
            )

        # 3. Padding days from next month to complete the grid
        # Grid size is 35 if it fits, otherwise 42
        grid_size = 35 if len(days) <= 35 else 42
        next_days_needed = grid_size - len(days)

        if next_days_needed > 0:
            if month == 12:
                next_month = 1
                next_year = year + 1
            else:
                next_month = month + 1
                next_year = year

            for d in range(1, next_days_needed + 1):
                if next_year <= 9999:
                    date_str = f"{next_year:04d}-{next_month:02d}-{d:02d}"
                    is_today = (next_year == today.year and next_month == today.month and d == today.day)
                else:
                    date_str = f"10000-{next_month:02d}-{d:02d}"
                    is_today = False
                days.append(
                    schemas.CalendarDayResponse(
                        date=date_str,
                        day_number=d,
                        is_current_month=False,
                        is_today=is_today
                    )
                )

        return schemas.CalendarGridResponse(
            days=days,
            month=month,
            year=year
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error during calendar generation: {str(e)}"
        )
