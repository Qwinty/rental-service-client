import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ImageWithFallback } from "../image-with-fallback/image-with-fallback";
import type { Offer } from "../../types/offer";
import type { RootState, AppDispatch } from "../../store";
import {
  addOfferToFavorites,
  removeOfferFromFavorites,
} from "../../store/action";

interface NearPlacesCardProps {
  offer: Offer;
  onHover?: (offer: Offer | null) => void;
}

function NearPlacesCard({ offer, onHover }: NearPlacesCardProps) {
  const {
    id,
    title,
    type,
    price,
    isPremium,
    rating,
    previewImage,
    isFavorite,
  } = offer;
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));

  // Рассчитываем ширину звездочек для рейтинга (рейтинг от 0 до 5, нужно получить проценты)
  const ratingWidth = `${Math.round(rating) * 20}%`;

  const handleMouseEnter = () => {
    if (onHover) {
      onHover(offer);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      // Show login tooltip
      setShowLoginTooltip(true);
      setTimeout(() => setShowLoginTooltip(false), 5000); // Hide tooltip after 5 seconds
      return;
    }

    if (isLoading) {
      return;
    }

    if (isFavorite) {
      dispatch(removeOfferFromFavorites(id));
    } else {
      dispatch(addOfferToFavorites(id));
    }
  };

  return (
    <article
      className="near-places__card place-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="near-places__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${id}`}>
          <ImageWithFallback
            src={previewImage}
            alt="Place image"
            width={260}
            height={200}
            className="place-card__image"
            lazy={true}
          />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <div className="place-card__bookmark-wrapper">
            <button
              className={`place-card__bookmark-button button ${
                isFavorite ? "place-card__bookmark-button--active" : ""
              }`}
              type="button"
              onClick={handleFavoriteToggle}
              disabled={isLoading}
            >
              <svg className="place-card__bookmark-icon" width="18" height="19">
                <use href="#icon-bookmark"></use>
              </svg>
              <span className="visually-hidden">
                {isFavorite ? "Remove from bookmarks" : "Add to bookmarks"}
              </span>
            </button>

            {showLoginTooltip && (
              <div className="place-card__login-tooltip">
                <p>Please login to add to favorites</p>
                <Link to="/login" className="place-card__login-button">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: ratingWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export { NearPlacesCard };
