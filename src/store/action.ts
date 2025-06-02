import type { CityOffer, OfferList, AuthUser, FullOffer } from "../types/offer";
import type { Dispatch } from "redux";
import { offerApi, userApi } from "../services";

// Константы для типов действий
export const ActionType = {
  CHANGE_CITY: "CHANGE_CITY",
  LOAD_OFFERS: "LOAD_OFFERS",
  UPDATE_OFFER: "UPDATE_OFFER",
  CHANGE_SORT_TYPE: "CHANGE_SORT_TYPE",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_USER: "SET_USER",
  SET_AUTH_STATUS: "SET_AUTH_STATUS",
  SET_FAVORITE_OFFERS: "SET_FAVORITE_OFFERS",
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

export const updateSingleOffer = (offer: FullOffer) =>
  ({
    type: ActionType.UPDATE_OFFER,
    payload: offer,
  } as const);

export const changeSortType = (sortType: string) =>
  ({
    type: ActionType.CHANGE_SORT_TYPE,
    payload: sortType,
  } as const);

export const setLoading = (isLoading: boolean) =>
  ({
    type: ActionType.SET_LOADING,
    payload: isLoading,
  } as const);

export const setError = (error: string | null) =>
  ({
    type: ActionType.SET_ERROR,
    payload: error,
  } as const);

export const setUser = (user: AuthUser | null) =>
  ({
    type: ActionType.SET_USER,
    payload: user,
  } as const);

export const setAuthStatus = (isAuthenticated: boolean) =>
  ({
    type: ActionType.SET_AUTH_STATUS,
    payload: isAuthenticated,
  } as const);

export const setFavoriteOffers = (offers: OfferList) =>
  ({
    type: ActionType.SET_FAVORITE_OFFERS,
    payload: offers,
  } as const);

// Асинхронные действия (thunks)
export const fetchOffers = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const offers = await offerApi.getAllOffers();
    dispatch(loadOffers(offers));
  } catch (error) {
    dispatch(
      setError(error instanceof Error ? error.message : "Failed to load offers")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchFavoriteOffers = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const offers = await offerApi.getFavoriteOffers();
    dispatch(setFavoriteOffers(offers));
  } catch (error) {
    dispatch(
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load favorite offers"
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk to add an offer to favorites
export const addOfferToFavorites =
  (offerId: string) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const updatedOffer = await offerApi.addFavoriteOffer(offerId);
      dispatch(updateSingleOffer(updatedOffer));
      dispatch(fetchFavoriteOffers());
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to add to favorites"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

// Thunk to remove an offer from favorites
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeOfferFromFavorites =
  (offerId: string) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const updatedOffer = await offerApi.removeFavoriteOffer(offerId);
      dispatch(updateSingleOffer(updatedOffer));
      dispatch(fetchFavoriteOffers());
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error
            ? error.message
            : "Failed to remove from favorites"
        )
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const checkAuthStatus = () => async (dispatch: Dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setAuthStatus(false));
      return;
    }

    const user = await userApi.checkAuth();
    dispatch(setUser(user));
    dispatch(setAuthStatus(true));
  } catch {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    dispatch(setAuthStatus(false));
  }
};

export const loginUser =
  (email: string, password: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await userApi.login({ email, password });
      localStorage.setItem("token", response.token);

      dispatch(setUser(response.user));
      dispatch(setAuthStatus(true));

      return response;
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : "Login failed")
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logoutUser = () => async (dispatch: Dispatch) => {
  console.log("Action: logoutUser action started");
  try {
    console.log("Action: Calling userApi.logout()...");
    await userApi.logout();
    console.log("Action: userApi.logout() completed");
  } catch (error) {
    console.error("Action: Logout error:", error);
  } finally {
    console.log("Action: Clearing user data and auth status...");
    dispatch(setUser(null));
    dispatch(setAuthStatus(false));
    localStorage.removeItem("token");
    console.log("Action: Logout completed - user data cleared");
  }
};
