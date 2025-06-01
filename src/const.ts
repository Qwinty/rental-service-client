export const RENTAL_OFFERS_COUNT = 312;

export const AppRoute = {
  Main: "/",
  Login: "/login",
  Favorites: "/favorites",
  Offer: "/offer/:id",
} as const;

export const AuthorizationStatus = {
  Auth: "AUTH",
  NoAuth: "NO_AUTH",
  Unknown: "UNKNOWN",
} as const;
