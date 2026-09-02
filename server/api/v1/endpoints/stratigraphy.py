from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.schemas.stratigraphy import (
    StratigraphicLayerCreate,
    StratigraphicLayerResponse,
    TrenchStratigraphyResponse,
)
from server.services.stratigraphy import (
    get_trench_stratigraphy,
    create_stratigraphic_layer,
)

router = APIRouter(prefix="/sites", tags=["3D Stratigraphy"])


@router.get("/{site_id}/stratigraphy", response_model=TrenchStratigraphyResponse)
def get_site_stratigraphy(site_id: str, db: Session = Depends(get_db)):
    return get_trench_stratigraphy(db=db, site_id=site_id)


@router.post(
    "/{site_id}/stratigraphy",
    response_model=StratigraphicLayerResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_site_stratigraphic_layer(
    site_id: str, layer_in: StratigraphicLayerCreate, db: Session = Depends(get_db)
):
    return create_stratigraphic_layer(db=db, site_id=site_id, layer_in=layer_in)
