import os
from fastapi import FastAPI, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from server import models, schemas, crud
from server.database import Base, engine, get_db

# Create tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed initial data if empty
    db = next(get_db())
    try:
        # Ensure tables are created (especially for SQLite in-memory or file-based)
        Base.metadata.create_all(bind=engine)
        if db.query(models.Property).count() == 0:
            initial_properties = [
                schemas.PropertyCreate(
                    title="Modern Suburban Villa",
                    location="Austin, TX",
                    price=450000.00,
                    bedrooms=3,
                    bathrooms=2.0,
                    description="Beautiful modern home with open floor plan, featuring high ceilings, large windows for natural light, and a state-of-the-art kitchen. The spacious backyard includes a covered patio perfect for entertaining. Located in a highly sought-after neighborhood with top-rated schools.",
                    image_urls=[
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCsRCmKbBzPpyzWT38-Kh8WZDN8D264lSPg1Jh2HvlopcMEqFoQUa11pZWdbgx6x-HkHNaB7xH0EvPAg5q5bbXqFHMWIotBrejT_ABIAE9EQBh4J_DhjIbXxZbFUH0eR2e7MfTaGipUS_R9OOl5l5vpZcLOXZ3aLky0RMKGsLaIbsL3wb5IKexmryNErUyNlDgEXbsci5bNKfPxzu-ZZDJHgBSmScG8-7Ouf6ZXYphW0pDhegSz-1LqzOJgmV-B6KijjVDvWugRb_U"
                    ],
                ),
                schemas.PropertyCreate(
                    title="Downtown Luxury Loft",
                    location="New York, NY",
                    price=850000.00,
                    bedrooms=2,
                    bathrooms=2.0,
                    description="Stunning luxury loft in the heart of downtown. Features exposed brick, industrial-style windows, premium stainless steel appliances, and a private balcony with city views.",
                    image_urls=[
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuDVVH2hEZmrDEpyzCGtAl3jaLU7GA-hLFHSVApBVgGDTBsD-tmoQTSSWika1BYW69GFD-cHTbp37uEsiezQtf0IxNkmKzeOXGQFMikZ95yQ5iayBzib6x-DENj8kmqwE7hCn-cDJ9fQRP6tqoLiwFgBOpmM2CmNTV7p0m79W-kmM7qvNeRamqyQ0Oqm2FhFxlp8zCDAft43Ir__XTIiaVChwpZgaq2pu4y0uQMngwAzUSKfDxMkssk8gawOUze3hJaKyIPyrGNsMi0"
                    ],
                ),
                schemas.PropertyCreate(
                    title="Charming Family Cottage",
                    location="Seattle, WA",
                    price=320000.00,
                    bedrooms=3,
                    bathrooms=1.5,
                    description="Cozy and charming cottage perfect for a family. Features a beautifully landscaped garden, updated bathrooms, and a warm fireplace in the living room.",
                    image_urls=[
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMbYJOy6TRyFT_xfWRblGk1Ig2HM6nL_A8zMkRqBVSEJxMIOasBx2Y5rbb0rNr4nAfkVm2xR9jJJluDIS06TdbCzt6CepOJ6SUhJrYDrLHxi5u1klQKVKjSWRd001t5ut8e7f1HJ6ErwKBHHacaAMBXByl_8WYOgBz5-OgLB10G5h-MxgkF0jFQz_iX7n1nma9mSjkiV8RbuxZrMn9WnZQLe_cr-ztT_DmvEkFdpM7rYYifZxrBq5sGvG215yV2DR8MacxSnZ7IDo"
                    ],
                ),
            ]
            for prop in initial_properties:
                crud.create_property(db, prop)
    finally:
        db.close()
    yield


app = FastAPI(
    title="HavenBroker API",
    description="API for searching properties and submitting contact inquiries",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to HavenBroker API"}


@app.get("/api/v1/properties", response_model=List[schemas.PropertyResponse])
def search_properties(
    location: Optional[str] = Query(
        None, description="Filter properties by city, state, or zip code"
    ),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(
        20, ge=1, le=100, description="Maximum number of records to return"
    ),
    db: Session = Depends(get_db),
):
    try:
        properties = crud.get_properties(db, location=location, skip=skip, limit=limit)
        # Map image_urls property to response
        response_data = []
        for p in properties:
            response_data.append(
                schemas.PropertyResponse(
                    id=p.id,
                    title=p.title,
                    location=p.location,
                    price=float(p.price),
                    bedrooms=p.bedrooms,
                    bathrooms=float(p.bathrooms),
                    description=p.description,
                    image_urls=p.image_urls,
                    created_at=p.created_at if hasattr(p, "created_at") else None,
                    updated_at=p.updated_at if hasattr(p, "updated_at") else None,
                )
            )
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/properties/{property_id}", response_model=schemas.PropertyResponse)
def get_property_details(property_id: UUID, db: Session = Depends(get_db)):
    p = crud.get_property(db, property_id)
    if not p:
        raise HTTPException(
            status_code=404, detail="Property with the specified ID does not exist"
        )
    return schemas.PropertyResponse(
        id=p.id,
        title=p.title,
        location=p.location,
        price=float(p.price),
        bedrooms=p.bedrooms,
        bathrooms=float(p.bathrooms),
        description=p.description,
        image_urls=p.image_urls,
        created_at=p.created_at if hasattr(p, "created_at") else None,
        updated_at=p.updated_at if hasattr(p, "updated_at") else None,
    )


@app.post(
    "/api/v1/contacts",
    response_model=schemas.ContactResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_contact_form(
    contact_in: schemas.ContactCreate, db: Session = Depends(get_db)
):
    # Verify property exists
    p = crud.get_property(db, contact_in.property_id)
    if not p:
        raise HTTPException(
            status_code=400, detail="Property with the specified ID does not exist"
        )

    try:
        db_contact = crud.create_contact(db, contact_in)
        return schemas.ContactResponse(
            id=db_contact.id,
            property_id=db_contact.property_id,
            user_name=db_contact.user_name,
            user_email=db_contact.user_email,
            message=db_contact.message,
            created_at=db_contact.created_at,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
