from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from server.database import get_db
from server.models import Tag, note_tags
from server.schemas import TagCreate, TagOut

router = APIRouter(prefix="/tags", tags=["Taxonomy & Tags"])


@router.get("", response_model=List[TagOut])
@router.get("/", response_model=List[TagOut])
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).all()
    result = []
    for tag in tags:
        count = (
            db.query(func.count(note_tags.c.note_id))
            .filter(note_tags.c.tag_id == tag.id)
            .scalar()
        )
        result.append(
            TagOut(
                id=tag.id,
                name=tag.name,
                created_at=tag.created_at,
                note_count=count or 0,
            )
        )
    return result


@router.post("", response_model=TagOut, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=TagOut, status_code=status.HTTP_201_CREATED)
def create_tag(tag_in: TagCreate, db: Session = Depends(get_db)):
    clean_name = tag_in.name.strip()
    if not clean_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Tag name cannot be empty."
        )

    existing = db.query(Tag).filter(Tag.name == clean_name).first()
    if existing:
        return TagOut(
            id=existing.id,
            name=existing.name,
            created_at=existing.created_at,
            note_count=0,
        )

    new_tag = Tag(name=clean_name)
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return TagOut(
        id=new_tag.id, name=new_tag.name, created_at=new_tag.created_at, note_count=0
    )
