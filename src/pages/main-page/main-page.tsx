import { useState, useMemo } from "react";
import { Header } from "../../components/header";
import { CitiesCardList } from "../../components/cities-card-list/cities-card-list";
import { Map } from "../../components/map";
import type { FullOffer, OfferList, Offer } from "../../types/offer";

interface MainPageProps {
  rentalOffersCount: number;
  offers: FullOffer[];
  offersList: OfferList;
}

function MainPage({ rentalOffersCount, offers, offersList }: MainPageProps) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  // Временно логируем данные чтобы убрать предупреждения линтера
  console.log("Offers:", offers, "Rental offers count:", rentalOffersCount);

  // Мемоизируем предложения Амстердама для карты
  const amsterdamOffers = useMemo(
    () => offers.filter((offer) => offer.city.name === "Amsterdam"),
    [offers]
  );

  const handleCardHover = (offer: Offer | null) => {
    setSelectedOffer(offer);
  };

  // Находим полное предложение для выбранной карточки
  const selectedFullOffer = selectedOffer
    ? amsterdamOffers.find((offer) => offer.id === selectedOffer.id)
    : undefined;

  return (
    <div className="page page--gray page--main">
      <Header showUserNav isLogoActive />

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Paris</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Cologne</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Brussels</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item tabs__item--active">
                  <span>Amsterdam</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Hamburg</span>
                </a>
              </li>
              <li className="locations__item">
                <a className="locations__item-link tabs__item" href="#">
                  <span>Dusseldorf</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {offersList.length} places to stay in Amsterdam
              </b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use href="#icon-arrow-select"></use>
                  </svg>
                </span>
                <ul className="places__options places__options--custom places__options--opened">
                  <li
                    className="places__option places__option--active"
                    tabIndex={0}
                  >
                    Popular
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: low to high
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Price: high to low
                  </li>
                  <li className="places__option" tabIndex={0}>
                    Top rated first
                  </li>
                </ul>
              </form>
              <CitiesCardList
                offers={offersList}
                onCardHover={handleCardHover}
              />
            </section>
            <div className="cities__right-section">
              <Map
                offers={amsterdamOffers}
                selectedOffer={selectedFullOffer}
                className="cities__map map"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { MainPage };
