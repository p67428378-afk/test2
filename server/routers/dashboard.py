from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import (
    ExcavationSite,
    DiscoveredArtifact,
    ExcavationTeam,
    TeamMember,
    LabAnalysis,
    Publication,
    MediaAsset,
)
from server.schemas import DashboardMetricsResponse

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard & Metrics"])


@router.get("/metrics", response_model=DashboardMetricsResponse)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    active_sites = db.query(ExcavationSite).count()
    cataloged_artifacts = db.query(DiscoveredArtifact).count()
    teams_count = db.query(ExcavationTeam).count()
    members_count = db.query(TeamMember).count()

    pending_lab = db.query(LabAnalysis).filter(LabAnalysis.status == "Pending").count()
    in_progress_lab = db.query(LabAnalysis).filter(LabAnalysis.status == "In-Progress").count()
    completed_lab = db.query(LabAnalysis).filter(LabAnalysis.status == "Completed").count()

    pubs_count = db.query(Publication).count()
    photos_count = db.query(MediaAsset).count()

    return DashboardMetricsResponse(
        active_sites_count=active_sites,
        cataloged_artifacts_count=cataloged_artifacts,
        excavation_teams_count=teams_count,
        team_members_count=members_count,
        pending_lab_tests_count=pending_lab,
        in_progress_lab_tests_count=in_progress_lab,
        completed_lab_tests_count=completed_lab,
        total_publications_count=pubs_count,
        total_photos_count=photos_count,
    )
