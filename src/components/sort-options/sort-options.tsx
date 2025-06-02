import { useState } from "react";
import { SortOffersType } from "../../const";

interface SortOptionsProps {
  currentSortType: string;
  onSortTypeChange: (sortType: string) => void;
}

export function SortOptions({
  currentSortType,
  onSortTypeChange,
}: SortOptionsProps) {
  const [isOpened, setIsOpened] = useState(false);

  const sortTypes = Object.values(SortOffersType);

  const handleSortTypeClick = (sortType: string) => {
    onSortTypeChange(sortType);
    setIsOpened(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpened(!isOpened)}
        onKeyDown={(evt) => {
          if (evt.key === "Enter" || evt.key === " ") {
            setIsOpened(!isOpened);
          }
        }}
      >
        {currentSortType}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={`places__options places__options--custom ${
          isOpened ? "places__options--opened" : ""
        }`}
      >
        {sortTypes.map((sortType) => (
          <li
            key={sortType}
            className={`places__option ${
              currentSortType === sortType ? "places__option--active" : ""
            }`}
            tabIndex={0}
            onClick={() => handleSortTypeClick(sortType)}
            onKeyDown={(evt) => {
              if (evt.key === "Enter" || evt.key === " ") {
                handleSortTypeClick(sortType);
              }
            }}
          >
            {sortType}
          </li>
        ))}
      </ul>
    </form>
  );
}
