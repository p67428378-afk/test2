from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.database import get_db
from server.models import Favorite, Quote, User
from server.schemas import FavoriteCreate, FavoriteResponse
from server.auth import get_current_user
from sqlalchemy.exc import IntegrityError
from typing import List

router = APIRouter(prefix="/api/v1/favorites", tags=["Favorites"])


@router.get("", response_model=List[FavoriteResponse])
def get_favorites(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """
    Retrieve the list of favorite quotes for the authenticated user.
    """
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    return favorites


@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def create_favorite(
    favorite_in: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Save a quote to favorites.
    Supports saving by quote_id or by providing text and author.
    Prevents duplicate entries.
    """
    quote_id = favorite_in.quote_id

    if not quote_id:
        if not favorite_in.text or not favorite_in.author:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Must provide either quote_id or both text and author",
            )

        # Check if quote already exists by text and author
        existing_quote = (
            db.query(Quote)
            .filter(Quote.text == favorite_in.text, Quote.author == favorite_in.author)
            .first()
        )

        if existing_quote:
            quote_id = existing_quote.id
        else:
            # Create new quote
            new_quote = Quote(
                text=favorite_in.text,
                author=favorite_in.author,
                category=favorite_in.category,
            )
            db.add(new_quote)
            db.commit()
            db.refresh(new_quote)
            quote_id = new_quote.id

    # Verify quote exists
    quote = db.query(Quote).filter(Quote.id == quote_id).first()
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Quote not found"
        )

    # Check if already favorited
    existing_fav = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id, Favorite.quote_id == quote_id)
        .first()
    )

    if existing_fav:
        # Prevent duplicate entries and keep it favorited
        return existing_fav

    # Create new favorite
    new_fav = Favorite(user_id=current_user.id, quote_id=quote_id)
    db.add(new_fav)
    try:
        db.commit()
        db.refresh(new_fav)
    except IntegrityError:
        db.rollback()
        # Fetch existing in case of race condition
        new_fav = (
            db.query(Favorite)
            .filter(Favorite.user_id == current_user.id, Favorite.quote_id == quote_id)
            .first()
        )

    return new_fav


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_favorite(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Remove a quote from favorites.
    """
    fav = (
        db.query(Favorite)
        .filter(Favorite.id == id, Favorite.user_id == current_user.id)
        .first()
    )

    if not fav:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found"
        )

    db.delete(fav)
    db.commit()
    return
