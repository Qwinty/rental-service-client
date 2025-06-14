import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { ImageWithFallback } from "../../components/image-with-fallback/image-with-fallback";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchFavoriteOffers,
  removeOfferFromFavorites,
} from "../../store/action";

function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteOffers, isLoading, error, isAuthenticated, user } =
    useSelector((state: RootState) => ({
      favoriteOffers: state.favoriteOffers,
      isLoading: state.isLoading,
      error: state.error,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
    }));

  // Debug authentication state
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("FavoritesPage Debug:", {
      isAuthenticated,
      user,
      hasToken: !!token,
      token: token ? token.substring(0, 20) + "..." : null,
    });
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("FavoritesPage: Fetching favorites for authenticated user");
      dispatch(fetchFavoriteOffers());
    } else {
      console.log(
        "FavoritesPage: User not authenticated, skipping favorites fetch"
      );
    }
  }, [dispatch, isAuthenticated]);

  // Group favorite offers by city for display
  const groupedFavorites = favoriteOffers.reduce((acc, offer) => {
    const cityName = offer.city.name;
    if (!acc[cityName]) {
      acc[cityName] = [];
    }
    acc[cityName].push(offer);
    return acc;
  }, {} as Record<string, typeof favoriteOffers>);

  const cityNames = Object.keys(groupedFavorites);

  if (!isAuthenticated) {
    return (
      <div className="page">
        <Header showUserNav />
        <main className="page__main page__main--favorites">
          <div className="page__favorites-container container">
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <p>Please log in to view your favorite offers.</p>
              <Link
                to="/login"
                style={{ color: "#4481c3", textDecoration: "none" }}
              >
                Go to Login →
              </Link>

              {/* Debug info */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                <strong>Debug Info:</strong>
                <br />
                Auth Status: {isAuthenticated ? "Yes" : "No"}
                <br />
                User: {user ? user.email : "None"}
                <br />
                Token: {localStorage.getItem("token") ? "Present" : "None"}
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page">
        <Header showUserNav />
        <main className="page__main page__main--favorites">
          <div className="page__favorites-container container">
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <p>Loading your favorite offers...</p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Header showUserNav />
        <main className="page__main page__main--favorites">
          <div className="page__favorites-container container">
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <p>Error loading favorites: {error}</p>

              {/* Additional debug info for 401 errors */}
              {error.includes("401") && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeaa7",
                    borderRadius: "4px",
                  }}
                >
                  <strong>Authentication Error:</strong> Your session may have
                  expired.
                  <Link
                    to="/login"
                    style={{ color: "#4481c3", marginLeft: "5px" }}
                  >
                    Please log in again →
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (favoriteOffers.length === 0) {
    return (
      <div className="page">
        <Header showUserNav />
        <main className="page__main page__main--favorites">
          <div className="page__favorites-container container">
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <p>You haven&apos;t saved any offers yet.</p>
              <Link to="/" style={{ color: "#4481c3", textDecoration: "none" }}>
                Browse offers →
              </Link>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header showUserNav />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              {cityNames.map((cityName) => (
                <li key={cityName} className="favorites__locations-items">
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <a className="locations__item-link" href="#">
                        <span>{cityName}</span>
                      </a>
                    </div>
                  </div>
                  <div className="favorites__places">
                    {groupedFavorites[cityName].map((offer) => (
                      <article
                        key={offer.id}
                        className="favorites__card place-card"
                      >
                        {offer.isPremium && (
                          <div className="place-card__mark">
                            <span>Premium</span>
                          </div>
                        )}
                        <div className="favorites__image-wrapper place-card__image-wrapper">
                          <Link to={`/offer/${offer.id}`}>
                            <ImageWithFallback
                              src={offer.previewImage}
                              alt="Place image"
                              width={150}
                              height={110}
                              className="place-card__image"
                              lazy={true}
                            />
                          </Link>
                        </div>
                        <div className="favorites__card-info place-card__info">
                          <div className="place-card__price-wrapper">
                            <div className="place-card__price">
                              <b className="place-card__price-value">
                                &euro;{offer.price}
                              </b>
                              <span className="place-card__price-text">
                                &#47;&nbsp;night
                              </span>
                            </div>
                            <button
                              className="place-card__bookmark-button place-card__bookmark-button--active button"
                              type="button"
                              onClick={() => {
                                // We can dispatch removeOfferFromFavorites here, but since this is a favorites page,
                                // user would expect the item to disappear immediately. The thunk handles this.
                                dispatch(removeOfferFromFavorites(offer.id));
                              }}
                            >
                              <svg
                                className="place-card__bookmark-icon"
                                width="18"
                                height="19"
                              >
                                <use href="#icon-bookmark"></use>
                              </svg>
                              <span className="visually-hidden">
                                Remove from bookmarks
                              </span>
                            </button>
                          </div>
                          <div className="place-card__rating rating">
                            <div className="place-card__stars rating__stars">
                              <span
                                style={{
                                  width: `${Math.round(offer.rating) * 20}%`,
                                }}
                              ></span>
                              <span className="visually-hidden">Rating</span>
                            </div>
                          </div>
                          <h2 className="place-card__name">
                            <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
                          </h2>
                          <p className="place-card__type">{offer.type}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export { FavoritesPage };
