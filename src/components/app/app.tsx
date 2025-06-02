import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { MainPage } from "../../pages/main-page/main-page";
import { FavoritesPage } from "../../pages/favorites-page/favorites-page";
import { LoginPage } from "../../pages/login-page/login-page";
import { OfferPage } from "../../pages/offer-page/offer-page";
import { NotFoundPage } from "../../pages/not-found-page/not-found-page";
import { PrivateRoute } from "../private-route/private-route";
import ApiTest from "../api-test";
import { AppRoute, AuthorizationStatus } from "../../const";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { checkAuthStatus, fetchOffers } from "../../store/action";

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

  useEffect(() => {
    console.log("App useEffect - Checking auth status and fetching offers");
    // Проверяем статус авторизации при загрузке приложения
    dispatch(checkAuthStatus());
    // Загружаем предложения
    dispatch(fetchOffers());
  }, [dispatch]);

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
    <BrowserRouter>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "#4481c3",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          Загрузка...
        </div>
      )}

      <Routes>
        <Route path={AppRoute.Main} element={<MainPage />} />
        <Route path={AppRoute.Login} element={<LoginPage />} />
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
  );
}

export { App };
