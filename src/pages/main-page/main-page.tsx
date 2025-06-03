import { useState, useMemo } from "react";
import { Header } from "../../components/header";
import { CitiesCardList } from "../../components/cities-card-list/cities-card-list";
import { CitiesList } from "../../components/cities-list/cities-list";
import { SortOptions } from "../../components/sort-options/sort-options";
import { Map } from "../../components/map";
import { SkeletonCardList } from "../../components/skeleton-card";
import { ImageCacheDebug } from "../../components/image-cache-debug/image-cache-debug";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changeCity, changeSortType } from "../../store/action";
import { sortOffers, getOffersByCity } from "../../utils";
import { CITIES_LOCATION } from "../../const";
import type { Offer } from "../../types/offer";

function MainPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const dispatch = useAppDispatch();
  const { city, offers, sortType, isLoading } = useAppSelector(
    (state) => state
  );

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

  // Определяем, показывать ли загрузку (если загружается или нет предложений для города)
  const shouldShowLoading =
    isLoading || (cityOffers.length === 0 && offers.length === 0);

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
                {shouldShowLoading
                  ? `Loading places in ${city.name}...`
                  : `${cityOffers.length} places to stay in ${city.name}`}
              </b>
              {!shouldShowLoading && (
                <SortOptions
                  currentSortType={sortType}
                  onSortTypeChange={handleSortTypeChange}
                />
              )}
              {shouldShowLoading ? (
                <SkeletonCardList count={6} />
              ) : (
                <CitiesCardList
                  offers={cityOffers}
                  onCardHover={handleCardHover}
                />
              )}
            </section>
            <div className="cities__right-section">
              <Map
                offers={shouldShowLoading ? [] : cityOffers}
                selectedOffer={
                  shouldShowLoading ? undefined : selectedFullOffer
                }
                className="cities__map map"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Image cache debug - only show in development */}
      {window.location.hostname === "localhost" && <ImageCacheDebug />}
    </div>
  );
}

export { MainPage };
