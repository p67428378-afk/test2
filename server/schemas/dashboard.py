from typing import List, Optional
from pydantic import BaseModel


class DashboardMetrics(BaseModel):
    active_sites_count: int
    cataloged_artifacts_count: int
    excavation_teams_count: int
    team_members_count: int
    pending_lab_tests_count: int
    completed_lab_tests_count: int
    queued_sync_count: int
    ml_anomalies_count: int
