import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { MainPage } from "../../pages/main-page/main-page";
import { FavoritesPage } from "../../pages/favorites-page/favorites-page";
import { LoginPage } from "../../pages/login-page/login-page";
import { RegisterPage } from "../../pages/register-page";
import { OfferPage } from "../../pages/offer-page/offer-page";
import { NotFoundPage } from "../../pages/not-found-page/not-found-page";
import { PrivateRoute } from "../private-route/private-route";
import { ServerStatusProvider } from "../../contexts/ServerStatusContext";
import { ServerLoading } from "../server-loading/server-loading";
import { ServerStatusIndicator } from "../server-status-indicator/server-status-indicator";
import ApiTest from "../api-test";
import { AppRoute, AuthorizationStatus } from "../../const";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  checkAuthStatus,
  fetchOffers,
  fetchFavoriteOffers,
} from "../../store/action";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
  }));

  console.log("AppRender - Auth state:", {
    isAuthenticated,
    isLoading,
    error,
  });

  // Initial load - check auth and fetch offers
  useEffect(() => {
    console.log("App useEffect - Checking auth status and fetching offers");
    // Проверяем статус авторизации при загрузке приложения
    dispatch(checkAuthStatus());
    // Загружаем предложения
    dispatch(fetchOffers());
  }, [dispatch]);

  // Refetch offers and favorites when authentication status changes
  useEffect(() => {
    console.log("App useEffect - Auth status changed, refetching data");
    dispatch(fetchOffers());

    // Fetch favorites only if user is authenticated
    if (isAuthenticated) {
      console.log("App useEffect - User authenticated, fetching favorites");
      dispatch(fetchFavoriteOffers());
    }
  }, [dispatch, isAuthenticated]);

  // Показываем ошибку если есть
  if (error) {
    console.error("App error:", error);
  }

  // Определяем статус авторизации для PrivateRoute
  const authStatus = isAuthenticated
    ? AuthorizationStatus.Auth
    : AuthorizationStatus.NoAuth;

  console.log("App - Auth status for PrivateRoute:", authStatus);

  return (
    <ServerStatusProvider>
      <BrowserRouter>
        {/* Server Loading Screen */}
        <ServerLoading />

        {/* Server Status Indicator */}
        <ServerStatusIndicator />

        {/* App Loading Indicator */}
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: "60px",
              right: "20px",
              background: "#4481c3",
              color: "white",
              padding: "5px 10px",
              borderRadius: "4px",
              zIndex: 999,
              fontSize: "12px",
            }}
          >
            Загрузка данных...
          </div>
        )}

        <Routes>
          <Route path={AppRoute.Main} element={<MainPage />} />
          <Route path={AppRoute.Login} element={<LoginPage />} />
          <Route path={AppRoute.Register} element={<RegisterPage />} />
          <Route path={AppRoute.ApiTest} element={<ApiTest />} />
          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute authorizationStatus={authStatus}>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Offer} element={<OfferPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ServerStatusProvider>
  );
}

export { App };
