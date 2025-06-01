import ApiService, { API_BASE_URL } from "./api";
import type { Review, ReviewList } from "../types/offer";

// Тип для создания отзыва
export interface CreateReviewData {
  comment: string;
  rating: number;
  [key: string]: string | number; // Добавляем индексную сигнатуру
}

class ReviewApi extends ApiService {
  constructor() {
    super(API_BASE_URL);
  }

  // Получить отзывы для предложения
  async getReviewsByOfferId(offerId: string): Promise<ReviewList> {
    return this.get<ReviewList>(`/reviews/${offerId}`);
  }

  // Добавить отзыв к предложению
  async addReview(
    offerId: string,
    reviewData: CreateReviewData
  ): Promise<Review> {
    return this.post<Review>(`/reviews/${offerId}`, reviewData);
  }
}

export default new ReviewApi();
