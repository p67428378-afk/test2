from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from server import crud, schemas
from server.database import get_db

router = APIRouter()


@router.get("/galleries", response_model=List[schemas.GalleryResponse])
def read_galleries(db: Session = Depends(get_db)):
    return crud.get_galleries(db)


@router.get(
    "/galleries/{gallery_id}/images", response_model=List[schemas.ImageResponse]
)
def read_gallery_images(gallery_id: str, db: Session = Depends(get_db)):
    gallery = crud.get_gallery_by_id(db, gallery_id)
    if not gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Gallery not found"
        )
    return crud.get_images_by_gallery(db, gallery_id)


@router.get("/images/{image_id}", response_model=schemas.ImageResponse)
def read_image(image_id: str, db: Session = Depends(get_db)):
    image = crud.get_image_by_id(db, image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
        )
    return image
