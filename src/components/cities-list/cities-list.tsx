import type { CityOffer } from "../../types/offer";

interface CitiesListProps {
  cities: readonly CityOffer[];
  currentCity: CityOffer;
  onCityClick: (city: CityOffer) => void;
}

export function CitiesList({
  cities,
  currentCity,
  onCityClick,
}: CitiesListProps) {
  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li key={city.name} className="locations__item">
              <a
                className={`locations__item-link tabs__item ${
                  city.name === currentCity.name ? "tabs__item--active" : ""
                }`}
                href="#"
                onClick={(evt) => {
                  evt.preventDefault();
                  onCityClick(city);
                }}
              >
                <span>{city.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
