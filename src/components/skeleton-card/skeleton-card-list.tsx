import { SkeletonCard } from "./skeleton-card";

interface SkeletonCardListProps {
  count?: number;
}

function SkeletonCardList({ count = 6 }: SkeletonCardListProps) {
  return (
    <div className="cities__places-list places__list tabs__content">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export { SkeletonCardList };
