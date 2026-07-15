import pytest
from server.database import SessionLocal
from server.models import Product
import json


@pytest.fixture(scope="function", autouse=True)
def seed_products():
    db = SessionLocal()
    db.query(Product).delete()
    db.commit()

    products_data = [
        {
            "name": "Dino-Adventure Bento",
            "description": "Fun dinosaur themed bento box for kids.",
            "price": 24.99,
            "image_urls": json.dumps(
                [
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAB-aVGQjrhFa8QDi5q-F4R6NgvgfBLusbWla6Ob8AxhOjvC3GwdXTWVj7o_NvszX49apD7875V9zDmZi_VNhNaIIiI-s7b88jS8UaNKAD67JAuipzzvRgcmHJZkXLssXGa4oRiKyC4IC2ki3tG7vDgFHsOj9YYVwdl3zUeM0IuDlkaCqEVllDfZ2PngLvpopJdOn5fUCR01a0221eDKvO62oVTBgUL97pIGibKb-Bh5AZvHezFD8nHJrRA6kWU4f5RVIvUpfOVS7wy"
                ]
            ),
            "category": "Kids",
            "rating": 4.9,
            "review_count": 124,
            "tags": json.dumps(["Kids", "Leakproof"]),
        },
        {
            "name": "Executive Sleek Steel",
            "description": "Premium insulated stainless steel lunch box for professionals.",
            "price": 45.00,
            "image_urls": json.dumps(
                [
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6-HKaEB9mujw30YClaMSJjpOZVIgz9EHTgYfsuwH45qHWLhgo6qdQcBsHOCbyzx5mu64zVHNteo3jtmX1Us0L1d-XeOiPjHTVXLedr5qnd0IK_aALcmHAzn423ebV3BAoCVnlbwZBYg9939mBokOKeMUPuJr0ejdLKDXQoZ3eHtDRP5xBO-mqZBb1zNiM0w53NFdlHxKHxgbT1h7ja-EhNVGaiFF9GKqmm8Qo7Cidelt5mqk90PA0igmv0hjd88uVN1L3Y8sMWcnl"
                ]
            ),
            "category": "Professionals",
            "rating": 4.8,
            "review_count": 312,
            "tags": json.dumps(["Pro", "Insulated"]),
        },
        {
            "name": "Easy-Open Thermal Warm",
            "description": "Easy-grip thermal lunch box designed for seniors.",
            "price": 34.99,
            "image_urls": json.dumps(
                [
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAoysGfT1DZLLGTk3pqjDXga8A-c691jp8HN3elAwzpSn_iD1T7dM68k6DzkbwPbzb1Qu6u5Gbj9Wo7SBtnAbNMbodZYnjAK7htJEuRXf8mQcCqv5lXCXtpvM2lj4v5cr6iIYX7LKZsqzVTq5ATpwZblg1iC9gSaXqT5mc8k2mbR6z8mFz0Vmfoy6cwwjoqkp-xGp4t7ek3VCdE-IPzfY58aXk0OpYC9dijjRTeJ9hOp2XjOidX5WN6P-HSuW6YRvRvtGf4ep2RRdW7"
                ]
            ),
            "category": "Seniors",
            "rating": 4.7,
            "review_count": 89,
            "tags": json.dumps(["Seniors", "Easy-Grip"]),
        },
    ]
    for p in products_data:
        db.add(Product(**p))
    db.commit()
    db.close()


def test_list_products(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    assert data[0]["name"] == "Dino-Adventure Bento"


def test_list_products_filter_category(client):
    response = client.get("/api/v1/products?category=Kids")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "Kids"


def test_get_product_by_id(client):
    # Get all first
    all_products = client.get("/api/v1/products").json()
    product_id = all_products[0]["product_id"]

    response = client.get(f"/api/v1/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["product_id"] == product_id


def test_get_product_not_found(client):
    response = client.get("/api/v1/products/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"
