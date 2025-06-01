import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/header";
import { NotFoundPage } from "../not-found-page/not-found-page";
import { ReviewsList } from "../../components/reviews-list";
import { CommentForm } from "../../components/comment-form";
import { Map } from "../../components/map";
import { NearPlacesCard } from "../../components/near-places-card";
import type { FullOffer, Offer } from "../../types/offer";
import { reviews } from "../../mocks/reviews";
import { offersList } from "../../mocks/offers-list";

interface OfferPageProps {
  offers: FullOffer[];
}

function OfferPage({ offers }: OfferPageProps) {
  const { id } = useParams<{ id: string }>();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Находим предложение по ID из URL
  const offer = offers.find((item) => item.id === id);

  // Мемоизируем предложения неподалеку
  const nearbyOffers = useMemo(
    () => offersList.filter((nearbyOffer) => nearbyOffer.id !== id).slice(0, 3),
    [id]
  );

  // Мемоизируем данные для карты
  const mapOffers = useMemo(() => {
    if (!offer) return [];
    return [
      offer,
      ...offers.filter((fullOffer) =>
        nearbyOffers.some((nearby) => nearby.id === fullOffer.id)
      ),
    ];
  }, [offer, offers, nearbyOffers]);

  const handleNearbyCardHover = (hoveredOffer: Offer | null) => {
    setSelectedOffer(hoveredOffer);
  };

  // Находим полное предложение для выбранной карточки
  const selectedFullOffer = selectedOffer
    ? offers.find((fullOffer) => fullOffer.id === selectedOffer.id)
    : undefined;

  const handleCommentSubmit = (comment: string, rating: number) => {
    console.log("New review:", { comment, rating });
    // Здесь будет логика отправки отзыва
  };

  // Если предложение не найдено, показываем страницу 404
  if (!offer) {
    return <NotFoundPage />;
  }

  const {
    title,
    type,
    price,
    isPremium,
    rating,
    description,
    bedrooms,
    goods,
    host,
    images,
    maxAdults,
  } = offer;

  // Рассчитываем ширину звездочек для рейтинга (рейтинг от 0 до 5, нужно получить проценты)
  const ratingWidth = `${Math.round(rating) * 20}%`;

  return (
    <div className="page">
      <Header showUserNav />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images.map((image, index) => (
                <div key={`image-${index}`} className="offer__image-wrapper">
                  <img
                    className="offer__image"
                    src={image}
                    alt="Photo studio"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{title}</h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use href="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>

              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {rating}
                </span>
              </div>

              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {maxAdults} adults
                </li>
              </ul>

              <div className="offer__price">
                <b className="offer__price-value">&euro;{price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>

              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
                    <img
                      className="offer__avatar user__avatar"
                      src={host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{host.name}</span>
                  {host.isPro && (
                    <span className="offer__user-status">Pro</span>
                  )}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{description}</p>
                </div>
              </div>

              <ReviewsList reviews={reviews} />
              <CommentForm onSubmit={handleCommentSubmit} />
            </div>
          </div>
          <Map
            offers={mapOffers}
            selectedOffer={selectedFullOffer}
            className="offer__map map"
          />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">
              Other places in the neighbourhood
            </h2>
            <div className="near-places__list places__list">
              {nearbyOffers.map((nearbyOffer) => (
                <NearPlacesCard
                  key={nearbyOffer.id}
                  offer={nearbyOffer}
                  onHover={handleNearbyCardHover}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export { OfferPage };
