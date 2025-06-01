import type { CityOffer, OfferList } from "../types/offer";

// Константы для типов действий
export const ActionType = {
  CHANGE_CITY: "CHANGE_CITY",
  LOAD_OFFERS: "LOAD_OFFERS",
  CHANGE_SORT_TYPE: "CHANGE_SORT_TYPE",
} as const;

// Создатели действий (action creators)
export const changeCity = (city: CityOffer) =>
  ({
    type: ActionType.CHANGE_CITY,
    payload: city,
  } as const);

export const loadOffers = (offers: OfferList) =>
  ({
    type: ActionType.LOAD_OFFERS,
    payload: offers,
  } as const);

export const changeSortType = (sortType: string) =>
  ({
    type: ActionType.CHANGE_SORT_TYPE,
    payload: sortType,
  } as const);
