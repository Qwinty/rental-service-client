import { useState, useMemo } from "react";
import { Header } from "../../components/header";
import { CitiesCardList } from "../../components/cities-card-list/cities-card-list";
import { CitiesList } from "../../components/cities-list/cities-list";
import { SortOptions } from "../../components/sort-options/sort-options";
import { Map } from "../../components/map";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changeCity, changeSortType } from "../../store/action";
import { sortOffers, getOffersByCity } from "../../utils";
import { CITIES_LOCATION } from "../../const";
import type { Offer } from "../../types/offer";

function MainPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const dispatch = useAppDispatch();
  const { city, offers, sortType } = useAppSelector((state) => state);

  // Получаем предложения для текущего города и сортируем их
  const cityOffers = useMemo(() => {
    const filteredOffers = getOffersByCity(offers, city.name);
    return sortOffers(filteredOffers, sortType);
  }, [offers, city.name, sortType]);

  const handleCardHover = (offer: Offer | null) => {
    setSelectedOffer(offer);
  };

  const handleCityChange = (newCity: typeof city) => {
    dispatch(changeCity(newCity));
  };

  const handleSortTypeChange = (newSortType: string) => {
    dispatch(changeSortType(newSortType));
  };

  // Находим полное предложение для выбранной карточки
  const selectedFullOffer = selectedOffer
    ? offers.find((offer) => offer.id === selectedOffer.id)
    : undefined;

  return (
    <div className="page page--gray page--main">
      <Header showUserNav isLogoActive />

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <CitiesList
          cities={CITIES_LOCATION}
          currentCity={city}
          onCityClick={handleCityChange}
        />
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">
                {cityOffers.length} places to stay in {city.name}
              </b>
              <SortOptions
                currentSortType={sortType}
                onSortTypeChange={handleSortTypeChange}
              />
              <CitiesCardList
                offers={cityOffers}
                onCardHover={handleCardHover}
              />
            </section>
            <div className="cities__right-section">
              <Map
                offers={cityOffers}
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
