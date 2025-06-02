import type { CityOffer, OfferList } from "./types/offer";
import { SortOffersType } from "./const";

// Получает город по имени из массива городов
export const getCity = (
  cityName: string,
  cities: readonly CityOffer[]
): CityOffer | undefined => {
  return cities.find((city) => city.name === cityName);
};

// Получает предложения для конкретного города
export const getOffersByCity = (
  offers: OfferList,
  cityName: string
): OfferList => {
  return offers.filter((offer) => offer.city.name === cityName);
};

// Сортирует предложения по выбранному типу
export const sortOffers = (offers: OfferList, sortType: string): OfferList => {
  const sortedOffers = [...offers];

  switch (sortType) {
    case SortOffersType.PriceLowToHigh:
      return sortedOffers.sort((a, b) => a.price - b.price);

    case SortOffersType.PriceHighToLow:
      return sortedOffers.sort((a, b) => b.price - a.price);

    case SortOffersType.TopRated:
      return sortedOffers.sort((a, b) => b.rating - a.rating);

    case SortOffersType.Popular:
    default:
      return sortedOffers;
  }
};
