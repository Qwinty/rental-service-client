import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app/app";
import { RENTAL_OFFERS_COUNT } from "./const";
import { offers } from "./mocks/offers";
import { offersList } from "./mocks/offers-list";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App
      rentalOffersCount={RENTAL_OFFERS_COUNT}
      offers={offers}
      offersList={offersList}
    />
  </StrictMode>
);
