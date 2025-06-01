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
