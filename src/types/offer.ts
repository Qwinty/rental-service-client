// Описывает расположение жилья
export interface OfferLocation {
  latitude: number;
  longitude: number;
  zoom?: number;
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
  city: CityOffer;
  location: OfferLocation;
  isPremium: boolean;
  isFavorite: boolean;
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
  maxChildren?: number;
  previewImage?: string;
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

// Типы для создания нового предложения
export interface CreateOfferData {
  title: string;
  description: string;
  city: string;
  type: string;
  price: number;
  rooms: number;
  guests: number;
  features: string[];
  latitude: number;
  longitude: number;
  isPremium: boolean;
  previewImage: File;
  photos: File[];
}

// Типы для аутентификации
export interface LoginData {
  email: string;
  password: string;
  [key: string]: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  userType: "normal" | "pro";
  avatar?: File;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  userType: "normal" | "pro";
  avatar?: string;
}

// Ответ от API авторизации
export interface AuthResponse {
  token: string;
  user: AuthUser;
}
