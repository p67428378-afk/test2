"""Task Comments API endpoints."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from server.api.v1.endpoints.auth import get_current_user
from server.crud import (
    create_comment,
    delete_comment,
    get_comment,
    get_task,
    list_comments,
    update_comment,
)
from server.database import get_db
from server.models import User
from server.schemas import CommentCreate, CommentResponse, CommentUpdate

router = APIRouter(tags=["comments"])


@router.get(
    "/tasks/{task_id}/comments",
    response_model=List[CommentResponse],
    status_code=status.HTTP_200_OK,
    summary="List comments for a task",
)
def get_task_comments(
    task_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List comments on a task."""
    task = get_task(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )
    comments = list_comments(db, task_id=task_id, skip=skip, limit=limit)
    return comments


@router.post(
    "/tasks/{task_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a comment to a task",
)
def add_comment_to_task(
    task_id: str,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Post a comment on a task."""
    task = get_task(db, task_id=task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID '{task_id}' not found",
        )
    comment = create_comment(
        db, task_id=task_id, author_id=current_user.id, comment_in=comment_in
    )
    return comment


@router.get(
    "/comments/{comment_id}",
    response_model=CommentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get comment by ID",
)
def get_comment_by_id(
    comment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve specific comment."""
    comment = get_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with ID '{comment_id}' not found",
        )
    return comment


@router.patch(
    "/comments/{comment_id}",
    response_model=CommentResponse,
    status_code=status.HTTP_200_OK,
    summary="Update comment",
)
@router.put(
    "/comments/{comment_id}",
    response_model=CommentResponse,
    status_code=status.HTTP_200_OK,
    summary="Update comment",
)
def update_comment_by_id(
    comment_id: str,
    comment_in: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Edit comment body (author or Admin only)."""
    comment = get_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with ID '{comment_id}' not found",
        )
    if current_user.role != "Admin" and comment.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to edit this comment",
        )
    updated = update_comment(db, comment=comment, comment_in=comment_in)
    return updated


@router.delete(
    "/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete comment",
)
def delete_comment_by_id(
    comment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete comment (author or Admin only)."""
    comment = get_comment(db, comment_id=comment_id)
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Comment with ID '{comment_id}' not found",
        )
    if current_user.role != "Admin" and comment.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied to delete this comment",
        )
    delete_comment(db, comment=comment)
    return None
