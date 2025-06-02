import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "leaflet/dist/leaflet.css";
import { App } from "./components/app/app";
import { store } from "./store";
import { offersList } from "./mocks/offers-list";
import { loadOffers } from "./store/action";

// Загружаем тестовые данные в store при инициализации
store.dispatch(loadOffers(offersList));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
