from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server import crud, schemas, models
from server.database import get_db
from server.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/analysis", response_model=schemas.AnalysisResponse)
def get_membership_analysis(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    memberships = crud.get_memberships_by_user(db, user_id=current_user.id)

    memberships_analysis = []
    total_monthly_fees = 0.0
    total_visits_this_month = 0
    total_estimated_waste = 0.0

    latest_visit_date = None
    alerts = []

    # Fetch notification settings
    notif_settings = crud.get_notification_settings_by_user(db, user_id=current_user.id)

    for m in memberships:
        visits = db.query(models.Visit).filter(models.Visit.membership_id == m.id).all()
        total_visits = len(visits)

        # Track latest visit date
        for v in visits:
            if latest_visit_date is None or v.visit_date > latest_visit_date:
                latest_visit_date = v.visit_date

        # Calculate attendance frequency (W1, W2, W3, W4)
        attendance_frequency = [0, 0, 0, 0]
        for v in visits:
            day = v.visit_date.day
            if day <= 7:
                attendance_frequency[0] += 1
            elif day <= 14:
                attendance_frequency[1] += 1
            elif day <= 21:
                attendance_frequency[2] += 1
            else:
                attendance_frequency[3] += 1

        # Calculations
        cost_per_visit = (
            m.monthly_fee / total_visits if total_visits > 0 else m.monthly_fee
        )
        utilization_percentage = min(100.0, (total_visits / 8.0) * 100.0)

        # Status
        if utilization_percentage >= 100.0:
            status_str = "Value-for-Money"
        elif utilization_percentage >= 50.0:
            status_str = "Good Value"
        else:
            status_str = "Underutilized"

        # Waste calculation
        target_cost_per_visit = m.monthly_fee / 8.0
        estimated_monthly_waste = max(
            0.0, m.monthly_fee - (total_visits * target_cost_per_visit)
        )

        # Check cost per visit threshold alert
        if notif_settings and notif_settings.email_notifications_enabled:
            if notif_settings.cost_per_visit_threshold is not None:
                if cost_per_visit > notif_settings.cost_per_visit_threshold:
                    alerts.append(
                        f"Your cost per visit for {m.gym_name} (${cost_per_visit:.2f}) "
                        f"exceeds your threshold of (${notif_settings.cost_per_visit_threshold:.2f})!"
                    )

        # Alternatives
        alternatives = []
        if total_visits < 8:
            # Pay-As-You-Go Pass
            pay_as_you_go_cost = total_visits * 15.0
            pay_as_you_go_savings = max(0.0, m.monthly_fee - pay_as_you_go_cost)
            alternatives.append(
                schemas.Alternative(
                    name="Pay-As-You-Go Pass",
                    description="Pay only when you visit. Best for infrequent visits.",
                    estimated_monthly_cost=pay_as_you_go_cost,
                    estimated_savings=pay_as_you_go_savings,
                )
            )

            # ClassPass Lite
            classpass_cost = 19.0
            classpass_savings = max(0.0, m.monthly_fee - classpass_cost)
            alternatives.append(
                schemas.Alternative(
                    name="ClassPass Lite",
                    description="Access local studios. Better matches your infrequent usage.",
                    estimated_monthly_cost=classpass_cost,
                    estimated_savings=classpass_savings,
                )
            )

            # Downgrade to Basic
            downgrade_cost = 45.0
            downgrade_savings = max(0.0, m.monthly_fee - downgrade_cost)
            alternatives.append(
                schemas.Alternative(
                    name="Downgrade to Basic",
                    description="Save money by losing premium classes.",
                    estimated_monthly_cost=downgrade_cost,
                    estimated_savings=downgrade_savings,
                )
            )

        memberships_analysis.append(
            schemas.MembershipAnalysis(
                membership_id=m.id,
                gym_name=m.gym_name,
                monthly_fee=m.monthly_fee,
                total_visits=total_visits,
                cost_per_visit=cost_per_visit,
                utilization_percentage=utilization_percentage,
                status=status_str,
                estimated_monthly_waste=estimated_monthly_waste,
                alternatives=alternatives,
                attendance_frequency=attendance_frequency,
            )
        )

        total_monthly_fees += m.monthly_fee
        total_visits_this_month += total_visits
        total_estimated_waste += estimated_monthly_waste

    # Check inactivity alert
    if notif_settings and notif_settings.email_notifications_enabled:
        if latest_visit_date:
            days_inactive = (date.today() - latest_visit_date).days
            if days_inactive > notif_settings.inactive_days_threshold:
                alerts.append(
                    f"You haven't visited the gym in {days_inactive} days! "
                    f"(Threshold: {notif_settings.inactive_days_threshold} days)"
                )

    average_cost_per_visit = (
        total_monthly_fees / total_visits_this_month
        if total_visits_this_month > 0
        else total_monthly_fees
    )

    overall_summary = schemas.OverallSummary(
        total_monthly_fees=total_monthly_fees,
        total_visits_this_month=total_visits_this_month,
        average_cost_per_visit=average_cost_per_visit,
        total_estimated_waste=total_estimated_waste,
        alerts=alerts,
    )

    return schemas.AnalysisResponse(
        overall_summary=overall_summary, memberships_analysis=memberships_analysis
    )
