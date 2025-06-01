import type { CityOffer } from "./offer";
import type { OfferList } from "./offer";

// Состояние приложения
export interface State {
  city: CityOffer;
  offers: OfferList;
  sortType: string;
}

// Экшен для изменения города
export interface ChangeCityAction {
  type: "CHANGE_CITY";
  payload: CityOffer;
}

// Экшен для загрузки предложений
export interface LoadOffersAction {
  type: "LOAD_OFFERS";
  payload: OfferList;
}

// Экшен для изменения типа сортировки
export interface ChangeSortTypeAction {
  type: "CHANGE_SORT_TYPE";
  payload: string;
}

// Объединенный тип для всех экшенов
export type AppActions =
  | ChangeCityAction
  | LoadOffersAction
  | ChangeSortTypeAction;
