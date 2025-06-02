import type { Offer, FullOffer } from "../types/offer";
import { offers } from "./offers";

// Функция для преобразования полного предложения в краткое для карточки
function createOfferFromFull(fullOffer: FullOffer): Offer {
  return {
    id: fullOffer.id,
    title: fullOffer.title,
    type: fullOffer.type,
    price: fullOffer.price,
    city: fullOffer.city,
    location: fullOffer.location,
    isPremium: fullOffer.isPremium,
    isFavorite: fullOffer.isFavorite,
    rating: fullOffer.rating,
    previewImage: fullOffer.previewImage || fullOffer.images[0],
  };
}

// Создаем список кратких предложений для карточек
export const offersList: Offer[] = offers.map(createOfferFromFull);
