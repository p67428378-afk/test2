"""Recommendation Engine service for scoring and ranking products based on user preferences."""

from typing import Any

from server.models import Product, UserPreference


def calculate_match_score(
    product: Product,
    pref: UserPreference | None,
) -> float:
    """
    Calculate content-based similarity score (0 - 100) between user preference and product.
    - Category Match: 40%
    - Price Alignment: 30%
    - Tag Overlap: 30%
    """
    if not pref:
        # Default baseline score if no preference is configured
        return round(min(100.0, max(10.0, (product.rating or 3.0) * 18.0)), 1)

    # 1. Category Match (40%)
    category_score = 0.0
    pref_cats = [c.strip().lower() for c in (pref.category_preferences or []) if c]
    if pref_cats:
        if product.category and product.category.strip().lower() in pref_cats:
            category_score = 40.0
    else:
        # If no category preferences specified, give neutral score
        category_score = 20.0

    # 2. Price Alignment (30%)
    price_score = 0.0
    min_p = pref.min_price if pref.min_price is not None else 0.0
    max_p = pref.max_price if pref.max_price is not None else 10000.0
    if min_p <= product.price <= max_p:
        price_score = 30.0
    elif product.price < min_p and min_p > 0:
        diff_ratio = (min_p - product.price) / min_p
        price_score = max(0.0, 30.0 * (1.0 - diff_ratio))
    elif product.price > max_p > 0:
        diff_ratio = (product.price - max_p) / max_p
        price_score = max(0.0, 30.0 * (1.0 - diff_ratio))

    # 3. Tag Match (30%)
    tag_score = 0.0
    pref_tags = set(t.strip().lower() for t in (pref.preferred_tags or []) if t)
    prod_tags = set(t.strip().lower() for t in (product.tags or []) if t)
    if pref_tags:
        overlap = pref_tags.intersection(prod_tags)
        tag_score = (len(overlap) / len(pref_tags)) * 30.0
    else:
        tag_score = 15.0  # neutral if no tags specified

    total_score = category_score + price_score + tag_score
    return round(min(100.0, max(0.0, total_score)), 1)


def generate_recommendations(
    products: list[Product],
    user_preference: UserPreference | None,
    limit: int = 5,
    min_rating: float | None = None,
    sort_by: str = "match_score",
    sort_order: str = "desc",
) -> list[dict[str, Any]]:
    """
    Score, filter, sort and return recommended products.
    Includes fallback mechanism for cold-start or constrained filters.
    """
    in_stock_products = [p for p in products if p.in_stock]
    if not in_stock_products:
        in_stock_products = products

    # 1. Filter by min_rating if provided
    eligible_products = in_stock_products
    if min_rating is not None:
        eligible_products = [
            p for p in eligible_products if (p.rating or 0.0) >= min_rating
        ]

    scored_items: list[dict[str, Any]] = []

    if eligible_products:
        for p in eligible_products:
            score = calculate_match_score(p, user_preference)
            scored_items.append(
                {
                    "product": p,
                    "match_score": score,
                    "recommendation_type": "ai_vector"
                    if user_preference
                    else "ai_vector",
                }
            )
    else:
        # Fallback: if min_rating filtered out all products or no products eligible,
        # return top-selling / popular products
        for p in in_stock_products:
            score = round(min(95.0, (p.rating or 3.0) * 18.0), 1)
            scored_items.append(
                {
                    "product": p,
                    "match_score": score,
                    "recommendation_type": "fallback_popular",
                }
            )

    # If all scored items have 0 score, switch recommendation_type to fallback_popular
    if all(item["match_score"] <= 0.0 for item in scored_items):
        for item in scored_items:
            item["match_score"] = round(
                min(90.0, (item["product"].rating or 3.0) * 18.0), 1
            )
            item["recommendation_type"] = "fallback_popular"

    # 2. Dynamic Sorting
    reverse = sort_order.lower() == "desc"

    if sort_by == "price":
        scored_items.sort(key=lambda x: x["product"].price, reverse=reverse)
    elif sort_by == "rating":
        scored_items.sort(key=lambda x: x["product"].rating or 0.0, reverse=reverse)
    else:  # match_score default
        scored_items.sort(key=lambda x: x["match_score"], reverse=reverse)

    return scored_items[:limit]
