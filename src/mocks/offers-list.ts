import type { Offer, FullOffer } from "../types/offer";
import { offers } from "./offers";

// Функция для преобразования полного предложения в краткое для карточки
function createOfferFromFull(fullOffer: FullOffer): Offer {
  return {
    id: fullOffer.id,
    title: fullOffer.title,
    type: fullOffer.type,
    price: fullOffer.price,
    isPremium: fullOffer.isPremium,
    rating: fullOffer.rating,
    previewImage: fullOffer.images[0], // Берем первое изображение как превью
  };
}

// Создаем список кратких предложений для карточек
export const offersList: Offer[] = offers.map(createOfferFromFull);
