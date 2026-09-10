from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from server.models import ResumeModel
from server.schemas import ResumeCreate, ResumeUpdate


AVAILABLE_TEMPLATES = [
    {
        "id": "classic",
        "name": "Classic Traditional",
        "description": "Clean, monochrome, traditional serif/sans layout ideal for conservative industries.",
        "preview_color": "#111827",
    },
    {
        "id": "modern",
        "name": "Modern Indigo",
        "description": "Vibrant indigo accents, sleek headers, and clean spacing for tech and startup roles.",
        "preview_color": "#4F46E5",
    },
    {
        "id": "executive",
        "name": "Executive Slate",
        "description": "Sophisticated dark slate palette with commanding section dividers for senior leadership.",
        "preview_color": "#0F172A",
    },
    {
        "id": "creative",
        "name": "Creative Sky",
        "description": "Energetic sky-blue highlighting for creative, design, and marketing professionals.",
        "preview_color": "#0284C7",
    },
    {
        "id": "minimalist",
        "name": "Minimalist Pure",
        "description": "Maximum whitespace, distraction-free layout focusing entirely on typography and content.",
        "preview_color": "#64748B",
    },
]


def get_templates() -> List[Dict[str, Any]]:
    return AVAILABLE_TEMPLATES


def create_resume(
    db: Session, resume_in: ResumeCreate, user_id: Optional[str] = None
) -> ResumeModel:
    resume = ResumeModel(
        user_id=user_id or resume_in.user_id,
        user_name=resume_in.user_name,
        email=resume_in.email,
        phone=resume_in.phone,
        portfolio_url=resume_in.portfolio_url,
        template_id=resume_in.template_id or "classic",
        experiences=resume_in.experiences or [],
        education=resume_in.education or [],
        skills=resume_in.skills or [],
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def get_resume(db: Session, resume_id: str) -> Optional[ResumeModel]:
    return db.query(ResumeModel).filter(ResumeModel.id == resume_id).first()


def list_resumes(
    db: Session, skip: int = 0, limit: int = 20, user_id: Optional[str] = None
) -> List[ResumeModel]:
    query = db.query(ResumeModel)
    if user_id:
        query = query.filter(ResumeModel.user_id == user_id)
    return query.order_by(ResumeModel.created_at.desc()).offset(skip).limit(limit).all()


def update_resume(
    db: Session,
    resume_id: str,
    resume_update: ResumeUpdate,
    user_id: Optional[str] = None,
) -> Optional[ResumeModel]:
    query = db.query(ResumeModel).filter(ResumeModel.id == resume_id)
    if user_id:
        query = query.filter(ResumeModel.user_id == user_id)
    resume = query.first()
    if not resume:
        return None

    update_data = resume_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(resume, field, value)

    db.commit()
    db.refresh(resume)
    return resume


def delete_resume(db: Session, resume_id: str, user_id: Optional[str] = None) -> bool:
    query = db.query(ResumeModel).filter(ResumeModel.id == resume_id)
    if user_id:
        query = query.filter(ResumeModel.user_id == user_id)
    resume = query.first()
    if not resume:
        return False
    db.delete(resume)
    db.commit()
    return True
