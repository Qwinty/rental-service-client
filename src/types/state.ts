import type { CityOffer, OfferList, AuthUser, FullOffer } from "./offer";

// Состояние приложения
export interface State {
  city: CityOffer;
  offers: OfferList;
  favoriteOffers: OfferList;
  sortType: string;
  isLoading: boolean;
  error: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
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

// Экшен для обновления отдельного предложения
export interface UpdateOfferAction {
  type: "UPDATE_OFFER";
  payload: FullOffer;
}

// Экшен для изменения типа сортировки
export interface ChangeSortTypeAction {
  type: "CHANGE_SORT_TYPE";
  payload: string;
}

// Экшен для управления загрузкой
export interface SetLoadingAction {
  type: "SET_LOADING";
  payload: boolean;
}

// Экшен для управления ошибками
export interface SetErrorAction {
  type: "SET_ERROR";
  payload: string | null;
}

// Экшен для установки пользователя
export interface SetUserAction {
  type: "SET_USER";
  payload: AuthUser | null;
}

// Экшен для установки статуса авторизации
export interface SetAuthStatusAction {
  type: "SET_AUTH_STATUS";
  payload: boolean;
}

// Экшен для установки избранных предложений
export interface SetFavoriteOffersAction {
  type: "SET_FAVORITE_OFFERS";
  payload: OfferList;
}

// Объединенный тип для всех экшенов
export type AppActions =
  | ChangeCityAction
  | LoadOffersAction
  | UpdateOfferAction
  | ChangeSortTypeAction
  | SetLoadingAction
  | SetErrorAction
  | SetUserAction
  | SetAuthStatusAction
  | SetFavoriteOffersAction;
