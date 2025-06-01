// Описывает расположение жилья
export interface OfferLocation {
  latitude: number;
  longitude: number;
  zoom: number;
}

// Описывает город и его координаты
export interface CityOffer {
  name: string;
  location: OfferLocation;
}

// Описывает хозяина жилья
export interface HostOffer {
  id: number;
  name: string;
  isPro: boolean;
  avatarUrl: string;
}

// Краткое описание предложения для карточки
export interface Offer {
  id: string;
  title: string;
  type: string;
  price: number;
  isPremium: boolean;
  rating: number;
  previewImage: string;
}

// Тип для списка предложений
export type OfferList = Offer[];

// Полное описание жилья
export interface FullOffer {
  id: string;
  title: string;
  type: string;
  price: number;
  city: CityOffer;
  location: OfferLocation;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  description: string;
  bedrooms: number;
  goods: string[];
  host: HostOffer;
  images: string[];
  maxAdults: number;
}

// Описывает пользователя, оставившего отзыв
export interface ReviewUser {
  id: number;
  name: string;
  avatarUrl: string;
  isPro: boolean;
}

// Описывает отзыв
export interface Review {
  id: string;
  date: string;
  user: ReviewUser;
  comment: string;
  rating: number;
}

// Тип для списка отзывов
export type ReviewList = Review[];
