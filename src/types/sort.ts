import { SortOffersType } from "../const";

export type SortType = (typeof SortOffersType)[keyof typeof SortOffersType];
