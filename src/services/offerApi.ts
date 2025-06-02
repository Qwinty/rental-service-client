import ApiService, { API_BASE_URL } from "./api";
import type { OfferList, FullOffer, CreateOfferData } from "../types/offer";

class OfferApi extends ApiService {
  constructor() {
    super(API_BASE_URL);
  }

  // Получить все предложения
  async getAllOffers(): Promise<OfferList> {
    return this.get<OfferList>("/offers");
  }

  // Получить полную информацию о предложении
  async getOfferById(id: string): Promise<FullOffer> {
    return this.get<FullOffer>(`/offers/${id}`);
  }

  // Получить избранные предложения (для текущего пользователя)
  async getFavoriteOffers(): Promise<OfferList> {
    // Updated endpoint to match server
    return this.get<OfferList>("/offers/favorites/list");
  }

  // Создать новое предложение
  async createOffer(offerData: CreateOfferData): Promise<FullOffer> {
    const formData = new FormData();

    // Добавляем текстовые поля
    formData.append("title", offerData.title);
    formData.append("description", offerData.description);
    formData.append("city", offerData.city);
    formData.append("type", offerData.type);
    formData.append("price", offerData.price.toString());
    formData.append("rooms", offerData.rooms.toString());
    formData.append("guests", offerData.guests.toString());
    formData.append("latitude", offerData.latitude.toString());
    formData.append("longitude", offerData.longitude.toString());
    formData.append("isPremium", offerData.isPremium.toString());

    // Добавляем features как JSON строку
    formData.append("features", JSON.stringify(offerData.features));

    // Добавляем превью изображение
    formData.append("previewImage", offerData.previewImage);

    // Добавляем дополнительные фотографии
    offerData.photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    return this.post<FullOffer>("/offers", formData);
  }

  // Добавить предложение в избранное
  async addFavoriteOffer(offerId: string): Promise<FullOffer> {
    return this.post<FullOffer>(`/offers/${offerId}/favorite`);
  }

  // Удалить предложение из избранного
  async removeFavoriteOffer(offerId: string): Promise<FullOffer> {
    return this.delete<FullOffer>(`/offers/${offerId}/favorite`);
  }
}

export default new OfferApi();
