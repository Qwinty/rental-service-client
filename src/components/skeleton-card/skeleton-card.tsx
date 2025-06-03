import "./skeleton-card.css";

function SkeletonCard() {
  return (
    <article className="cities__card place-card skeleton-card">
      <div className="cities__image-wrapper place-card__image-wrapper">
        <div className="skeleton-image"></div>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <div className="skeleton-text skeleton-price"></div>
          </div>
          <div className="place-card__bookmark-wrapper">
            <div className="skeleton-bookmark"></div>
          </div>
        </div>
        <div className="place-card__rating rating">
          <div className="skeleton-rating"></div>
        </div>
        <h2 className="place-card__name">
          <div className="skeleton-text skeleton-title"></div>
        </h2>
        <p className="place-card__type">
          <div className="skeleton-text skeleton-type"></div>
        </p>
      </div>
    </article>
  );
}

export { SkeletonCard };
