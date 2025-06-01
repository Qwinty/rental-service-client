import { CitiesCard } from "../cities-card/cities-card";
import type { OfferList } from "../../types/offer";

interface CitiesCardListProps {
  offers: OfferList;
}

function CitiesCardList({ offers }: CitiesCardListProps) {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <CitiesCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

export { CitiesCardList };
