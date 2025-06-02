import type { State } from "../types/state";
import type { AppActions } from "../types/state";
import type { Offer, FullOffer } from "../types/offer";
import { CITIES_LOCATION, DEFAULT_CITY, SortOffersType } from "../const";
import { getCity } from "../utils";
import { ActionType } from "./action";

// Функция для преобразования полного предложения в краткое для карточки
function createOfferFromFull(fullOffer: FullOffer): Offer {
  return {
    id: fullOffer.id,
    title: fullOffer.title,
    type: fullOffer.type,
    price: fullOffer.price,
    city: fullOffer.city,
    location: fullOffer.location,
    isPremium: fullOffer.isPremium,
    isFavorite: fullOffer.isFavorite,
    rating: fullOffer.rating,
    previewImage: fullOffer.previewImage || fullOffer.images?.[0] || "",
  };
}

// Начальное состояние
const initialState: State = {
  city: getCity(DEFAULT_CITY, CITIES_LOCATION) || CITIES_LOCATION[0],
  offers: [],
  favoriteOffers: [],
  sortType: SortOffersType.Popular,
  isLoading: false,
  error: null,
  user: null,
  isAuthenticated: false,
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

    case ActionType.UPDATE_OFFER: {
      const updatedFullOffer = action.payload;
      const updatedOffer = createOfferFromFull(updatedFullOffer);

      return {
        ...state,
        offers: state.offers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        ),
        favoriteOffers: updatedOffer.isFavorite
          ? state.favoriteOffers
              .map((favOffer) =>
                favOffer.id === updatedOffer.id ? updatedOffer : favOffer
              )
              .filter((value, index, self) => {
                const firstIndex = self.findIndex((t) => t.id === value.id);
                return firstIndex === index;
              })
              .concat(
                state.favoriteOffers.find((fo) => fo.id === updatedOffer.id)
                  ? []
                  : [updatedOffer]
              )
              .filter(
                (value, index, self) =>
                  self.findIndex((t) => t.id === value.id) === index
              )
          : state.favoriteOffers.filter(
              (favOffer) => favOffer.id !== updatedOffer.id
            ),
      };
    }

    case ActionType.CHANGE_SORT_TYPE:
      return {
        ...state,
        sortType: action.payload,
      };

    case ActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ActionType.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case ActionType.SET_AUTH_STATUS:
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case ActionType.SET_FAVORITE_OFFERS:
      return {
        ...state,
        favoriteOffers: action.payload,
      };

    default:
      return state;
  }
};
