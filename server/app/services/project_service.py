from typing import List, Optional
from sqlalchemy.orm import Session
from server.models import Project, ProjectTag


class ProjectService:
    @staticmethod
    def get_projects(
        db: Session, tag: Optional[str] = None, skip: int = 0, limit: int = 20
    ) -> List[Project]:
        query = db.query(Project)
        if tag:
            clean_tag = tag.strip()
            query = (
                query.join(Project.tags)
                .filter(ProjectTag.tag.ilike(f"%{clean_tag}%"))
                .distinct()
            )
        return query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def get_project_by_id(db: Session, project_id: str) -> Optional[Project]:
        return db.query(Project).filter(Project.id == project_id).first()
