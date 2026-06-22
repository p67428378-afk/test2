from server import models


def test_get_galleries_empty(client):
    response = client.get("/api/v1/galleries")
    assert response.status_code == 200
    assert response.json() == []


def test_get_galleries_with_data(client, db):
    # Seed a gallery
    gallery = models.Gallery(name="Nature", description="Beautiful landscapes")
    db.add(gallery)
    db.commit()
    db.refresh(gallery)

    response = client.get("/api/v1/galleries")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Nature"
    assert data[0]["description"] == "Beautiful landscapes"
    assert "id" in data[0]


def test_get_gallery_images(client, db):
    # Seed a gallery and an image
    gallery = models.Gallery(name="Weddings", description="Special days")
    db.add(gallery)
    db.commit()
    db.refresh(gallery)

    image = models.Image(
        gallery_id=gallery.id,
        url="http://example.com/wedding1.jpg",
        title="First Dance",
    )
    db.add(image)
    db.commit()
    db.refresh(image)

    # Test valid gallery
    response = client.get(f"/api/v1/galleries/{gallery.id}/images")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["url"] == "http://example.com/wedding1.jpg"
    assert data[0]["title"] == "First Dance"
    assert data[0]["gallery_id"] == str(gallery.id)

    # Test invalid gallery ID
    response = client.get(
        "/api/v1/galleries/3fa85f64-5717-4562-b3fc-2c963f66afa6/images"
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Gallery not found"


def test_get_single_image(client, db):
    # Seed a gallery and an image
    gallery = models.Gallery(name="Portraits", description="Beautiful faces")
    db.add(gallery)
    db.commit()
    db.refresh(gallery)

    image = models.Image(
        gallery_id=gallery.id,
        url="http://example.com/portrait1.jpg",
        title="Golden Hour Smile",
    )
    db.add(image)
    db.commit()
    db.refresh(image)

    # Test valid image ID
    response = client.get(f"/api/v1/images/{image.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == "http://example.com/portrait1.jpg"
    assert data["title"] == "Golden Hour Smile"
    assert data["gallery_id"] == str(gallery.id)

    # Test invalid image ID
    response = client.get("/api/v1/images/3fa85f64-5717-4562-b3fc-2c963f66afa6")
    assert response.status_code == 404
    assert response.json()["detail"] == "Image not found"
