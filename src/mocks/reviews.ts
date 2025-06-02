import type { Review } from "../types/offer";

export const reviews: Review[] = [
  {
    id: "1",
    date: "2024-04-24",
    user: {
      id: 1,
      name: "Max",
      avatarUrl: "/img/avatar-max.jpg",
      isPro: false,
    },
    comment:
      "A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.",
    rating: 4,
  },
  {
    id: "2",
    date: "2024-03-15",
    user: {
      id: 2,
      name: "Emily",
      avatarUrl: "/img/avatar-angelina.jpg",
      isPro: true,
    },
    comment:
      "Absolutely wonderful place! Clean, comfortable, and in a great location. The host was very helpful and responsive. Would definitely recommend!",
    rating: 5,
  },
  {
    id: "3",
    date: "2024-02-10",
    user: {
      id: 3,
      name: "John",
      avatarUrl: "/img/avatar-max.jpg",
      isPro: false,
    },
    comment:
      "Good value for money. The apartment had everything we needed for our stay. Some minor issues with the heating, but overall a pleasant experience.",
    rating: 4,
  },
];
