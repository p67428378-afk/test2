from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from server import crud, schemas
from server.database import get_db

router = APIRouter()

@router.get("/reviews", response_model=List[schemas.ReviewListItem])
def read_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    reviews = crud.get_reviews(db, skip=skip, limit=limit)
    result = []
    for r in reviews:
        result.append(schemas.ReviewListItem(
            review_id=r.review_id,
            pr_id=r.pr_id,
            repo_name=r.repo_name,
            status=r.status,
            issues_count=len(r.issues),
            created_at=r.created_at
        ))
    return result

@router.get("/reviews/{id}", response_model=schemas.ReviewDetail)
def read_review(id: UUID, db: Session = Depends(get_db)):
    review = crud.get_review_by_id(db, review_id=id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    issues = [
        schemas.IssueItem(
            issue_id=issue.issue_id,
            file_path=issue.file_path,
            line_number=issue.line_number,
            message=issue.message,
            severity=issue.severity
        )
        for issue in review.issues
    ]
    
    return schemas.ReviewDetail(
        review_id=review.review_id,
        pr_id=review.pr_id,
        repo_name=review.repo_name,
        status=review.status,
        title=review.title,
        branch_name=review.branch_name,
        scan_duration_seconds=review.scan_duration_seconds,
        created_at=review.created_at,
        issues=issues
    )
