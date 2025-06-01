import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "leaflet/dist/leaflet.css";
import { App } from "./components/app/app";
import { RENTAL_OFFERS_COUNT } from "./const";
import { offers } from "./mocks/offers";
import { offersList } from "./mocks/offers-list";
import { store } from "./store";
import { loadOffers } from "./store/action";

// Загружаем тестовые данные в store
store.dispatch(loadOffers(offersList));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App
        rentalOffersCount={RENTAL_OFFERS_COUNT}
        offers={offers}
        offersList={offersList}
      />
    </Provider>
  </StrictMode>
);
