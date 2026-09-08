from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from server.database import get_db
from server.schemas import (
    CodebaseAnalysisRunRequest,
    CodebaseAnalysisRunResponse,
    CodebaseReport,
)
from server.services.codebase_analyzer_service import codebase_analyzer_service

router = APIRouter(prefix="/codebase-analyzer", tags=["codebase-analyzer"])

DbSession = Annotated[Session, Depends(get_db)]


@router.get("/report", response_model=CodebaseReport)
def get_codebase_report(
    issue_key: str = Query(
        default="SCRUM-231",
        description="Jira issue key to retrieve report for",
    ),
):
    return codebase_analyzer_service.get_report(issue_key=issue_key)


@router.post("/run", response_model=CodebaseAnalysisRunResponse, status_code=201)
def trigger_codebase_analysis(
    db: DbSession,
    payload: CodebaseAnalysisRunRequest | None = None,
):
    request_data = payload or CodebaseAnalysisRunRequest()
    return codebase_analyzer_service.trigger_analysis(db, request_data)
