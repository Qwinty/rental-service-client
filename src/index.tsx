import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app/app";
import { RENTAL_OFFERS_COUNT } from "./const";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App rentalOffersCount={RENTAL_OFFERS_COUNT} />
  </StrictMode>
);
