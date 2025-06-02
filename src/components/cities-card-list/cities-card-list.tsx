import { CitiesCard } from "../cities-card/cities-card";
import type { OfferList, Offer } from "../../types/offer";

interface CitiesCardListProps {
  offers: OfferList;
  onCardHover?: (offer: Offer | null) => void;
}

function CitiesCardList({ offers, onCardHover }: CitiesCardListProps) {
  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <CitiesCard key={offer.id} offer={offer} onHover={onCardHover} />
      ))}
    </div>
  );
}

export { CitiesCardList };
