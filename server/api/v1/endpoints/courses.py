from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/courses", response_model=List[schemas.Course])
def read_courses(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    try:
        courses = crud.get_courses(db, skip=skip, limit=limit)
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/courses", response_model=schemas.Course, status_code=201)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_course(db, course=course)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
