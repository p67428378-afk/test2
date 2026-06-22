from fastapi import FastAPI
from server.api.v1.endpoints import password_reset, galleries, bookings, contact
from server.database import Base, engine, SessionLocal
from server import models

Base.metadata.create_all(bind=engine)

# Seed default categories on startup
db = SessionLocal()
try:
    for cat in ["Nature", "Weddings", "Portraits"]:
        existing = db.query(models.Gallery).filter(models.Gallery.name == cat).first()
        if not existing:
            new_gallery = models.Gallery(
                name=cat, description=f"Professional {cat} photography gallery"
            )
            db.add(new_gallery)
    db.commit()
finally:
    db.close()

app = FastAPI()

# Include existing routers
app.include_router(password_reset.router, prefix="/api/v1", tags=["password-reset"])

# Include new routers
app.include_router(galleries.router, prefix="/api/v1", tags=["galleries"])
app.include_router(bookings.router, prefix="/api/v1", tags=["bookings"])
app.include_router(contact.router, prefix="/api/v1", tags=["contact"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Photographer Portfolio and Booking API"}
