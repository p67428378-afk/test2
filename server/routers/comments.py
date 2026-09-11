from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User
from server.schemas import CommentCreate, CommentOut
from server.auth import get_current_user
from server.services import add_comment, get_comments

router = APIRouter(prefix="/api/v1/contracts", tags=["Comments"])


@router.post(
    "/{id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED
)
def create_comment_for_contract(
    id: str,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = add_comment(db, id, comment_in, current_user)
    return {
        "id": comment.id,
        "contract_id": comment.contract_id,
        "parent_id": comment.parent_id,
        "user_id": comment.user_id,
        "clause_reference": comment.clause_reference,
        "content": comment.content,
        "is_internal_only": comment.is_internal_only,
        "is_locked": comment.is_locked,
        "created_at": comment.created_at,
        "user_email": comment.user.email if comment.user else None,
        "user_name": comment.user.full_name if comment.user else None,
    }


@router.get("/{id}/comments", response_model=List[CommentOut])
def get_comments_for_contract(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comments = get_comments(db, id, current_user)
    return [
        {
            "id": c.id,
            "contract_id": c.contract_id,
            "parent_id": c.parent_id,
            "user_id": c.user_id,
            "clause_reference": c.clause_reference,
            "content": c.content,
            "is_internal_only": c.is_internal_only,
            "is_locked": c.is_locked,
            "created_at": c.created_at,
            "user_email": c.user.email if c.user else None,
            "user_name": c.user.full_name if c.user else None,
        }
        for c in comments
    ]
