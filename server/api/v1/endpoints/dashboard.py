from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.site import ExcavationSite
from server.models.artifact import DiscoveredArtifact
from server.models.team import ExcavationTeam, TeamMember
from server.models.lab import LabAnalysis
from server.models.sync import SyncTransaction
from server.models.ml import MLClassificationResult
from server.schemas.dashboard import DashboardMetrics

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/metrics", response_model=DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    sites_cnt = db.query(ExcavationSite).count()
    artifacts_cnt = db.query(DiscoveredArtifact).count()
    teams_cnt = db.query(ExcavationTeam).count()
    members_cnt = db.query(TeamMember).count()
    pending_lab_cnt = db.query(LabAnalysis).filter(LabAnalysis.status == "Pending").count()
    completed_lab_cnt = db.query(LabAnalysis).filter(LabAnalysis.status == "Completed").count()
    sync_cnt = db.query(SyncTransaction).count()
    ml_anomalies_cnt = db.query(MLClassificationResult).filter(MLClassificationResult.requires_manual_override == True).count()

    return DashboardMetrics(
        active_sites_count=sites_cnt,
        cataloged_artifacts_count=artifacts_cnt,
        excavation_teams_count=teams_cnt,
        team_members_count=members_cnt,
        pending_lab_tests_count=pending_lab_cnt,
        completed_lab_tests_count=completed_lab_cnt,
        queued_sync_count=sync_cnt,
        ml_anomalies_count=ml_anomalies_cnt,
    )
