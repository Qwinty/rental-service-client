import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/header";
import { NotFoundPage } from "../not-found-page/not-found-page";
import { ReviewsList } from "../../components/reviews-list";
import { CommentForm } from "../../components/comment-form";
import { Map } from "../../components/map";
import { NearPlacesCard } from "../../components/near-places-card";
import { ImageGallery } from "../../components/image-gallery";
import { useAppSelector } from "../../hooks";
import { offerApi, reviewApi } from "../../services";
import type { FullOffer, Offer, ReviewList } from "../../types/offer";

function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [fullOffer, setFullOffer] = useState<FullOffer | null>(null);
  const [reviews, setReviews] = useState<ReviewList>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { offers, user, isAuthenticated } = useAppSelector((state) => state);

  // Загружаем полную информацию о предложении при изменении ID
  useEffect(() => {
    if (!id) return;

    const loadOffer = async () => {
      try {
        setIsLoading(true);
        const offer = await offerApi.getOfferById(id);
        setFullOffer(offer);
      } catch (error) {
        console.error("Failed to load offer:", error);
        setFullOffer(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadOffer();
  }, [id]);

  // Загружаем отзывы для предложения
  useEffect(() => {
    if (!id) return;

    const loadReviews = async () => {
      try {
        const reviewsData = await reviewApi.getReviewsByOfferId(id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setReviews([]);
      }
    };

    loadReviews();
  }, [id]);

  // Мемоизируем предложения неподалеку (из существующих в store)
  const nearbyOffers = useMemo(() => {
    if (!fullOffer) return [];
    return offers
      .filter(
        (offer) => offer.id !== id && offer.city.name === fullOffer.city.name
      )
      .slice(0, 3);
  }, [offers, fullOffer, id]);

  // Мемоизируем данные для карты
  const mapOffers = useMemo(() => {
    if (!fullOffer) return [];
    // Конвертируем FullOffer в Offer для Map
    const mainOffer: Offer = {
      id: fullOffer.id,
      title: fullOffer.title,
      type: fullOffer.type,
      price: fullOffer.price,
      city: fullOffer.city,
      location: fullOffer.location,
      isPremium: fullOffer.isPremium,
      isFavorite: fullOffer.isFavorite,
      rating: fullOffer.rating,
      previewImage: fullOffer.previewImage || fullOffer.images[0],
    };

    return [mainOffer, ...nearbyOffers];
  }, [fullOffer, nearbyOffers]);

  const handleNearbyCardHover = (hoveredOffer: Offer | null) => {
    setSelectedOffer(hoveredOffer);
  };

  const handleCommentSubmit = async (comment: string, rating: number) => {
    if (!id) {
      throw new Error("Offer ID is missing");
    }

    if (!isAuthenticated || !user) {
      throw new Error("You must be logged in to submit a review");
    }

    try {
      // Отправляем отзыв через API
      const newReview = await reviewApi.addReview(id, {
        comment,
        rating,
      });

      // Обновляем список отзывов
      setReviews((prevReviews) => [newReview, ...prevReviews]);

      console.log("Review submitted successfully:", newReview);
    } catch (error) {
      console.error("Failed to submit review:", error);
      // Проброс ошибки для обработки в модальном окне
      throw error;
    }
  };

  // Показываем loading
  if (isLoading) {
    return (
      <div className="page">
        <Header showUserNav />
        <main className="page__main page__main--offer">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка предложения...</p>
          </div>
        </main>
      </div>
    );
  }

  // Если предложение не найдено, показываем страницу 404
  if (!fullOffer) {
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
  } = fullOffer;

  // Рассчитываем ширину звездочек для рейтинга (рейтинг от 0 до 5, нужно получить проценты)
  const ratingWidth = `${Math.round(rating) * 20}%`;

  return (
    <div className="page">
      <Header showUserNav />

      <main className="page__main page__main--offer">
        <section className="offer">
          <ImageGallery images={images} title={title} />

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
            selectedOffer={selectedOffer || undefined}
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
