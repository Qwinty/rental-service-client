import { useEffect, useRef } from "react";
import L from "leaflet";
import type { FullOffer } from "../../types/offer";

interface MapProps {
  offers: FullOffer[];
  selectedOffer?: FullOffer;
  className?: string;
}

const DEFAULT_CUSTOM_ICON = L.icon({
  iconUrl: "/img/pin.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const CURRENT_CUSTOM_ICON = L.icon({
  iconUrl: "/img/pin-active.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function Map({ offers, selectedOffer, className }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapRef.current && !map.current) {
      // Получаем координаты города из первого предложения
      const cityLocation = offers[0]?.city.location;

      if (cityLocation) {
        map.current = L.map(mapRef.current, {
          center: {
            lat: cityLocation.latitude,
            lng: cityLocation.longitude,
          },
          zoom: cityLocation.zoom,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map.current);

        markerLayer.current = L.layerGroup().addTo(map.current);
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [offers]);

  useEffect(() => {
    if (map.current && markerLayer.current) {
      markerLayer.current.clearLayers();

      offers.forEach((offer) => {
        const marker = L.marker(
          {
            lat: offer.location.latitude,
            lng: offer.location.longitude,
          },
          {
            icon:
              selectedOffer && selectedOffer.id === offer.id
                ? CURRENT_CUSTOM_ICON
                : DEFAULT_CUSTOM_ICON,
          }
        );

        marker.addTo(markerLayer.current!).bindPopup(offer.title);
      });
    }
  }, [offers, selectedOffer]);

  return <div ref={mapRef} className={className} />;
}

export { Map };
