import type { State } from "../types/state";
import type { AppActions } from "../types/state";
import { CITIES_LOCATION, DEFAULT_CITY, SortOffersType } from "../const";
import { getCity } from "../utils";
import { ActionType } from "./action";

// Начальное состояние
const initialState: State = {
  city: getCity(DEFAULT_CITY, CITIES_LOCATION) || CITIES_LOCATION[0],
  offers: [],
  sortType: SortOffersType.Popular,
};

// Редьюсер
export const reducer = (
  state: State = initialState,
  action: AppActions
): State => {
  switch (action.type) {
    case ActionType.CHANGE_CITY:
      return {
        ...state,
        city: action.payload,
      };

    case ActionType.LOAD_OFFERS:
      return {
        ...state,
        offers: action.payload,
      };

    case ActionType.CHANGE_SORT_TYPE:
      return {
        ...state,
        sortType: action.payload,
      };

    default:
      return state;
  }
};
