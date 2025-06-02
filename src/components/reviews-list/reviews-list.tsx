import { ReviewComponent } from "../review";
import type { ReviewList } from "../../types/offer";

interface ReviewsListProps {
  reviews: ReviewList;
}

function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot;{" "}
        <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ul className="reviews__list">
        {reviews.map((review) => (
          <ReviewComponent key={review.id} review={review} />
        ))}
      </ul>
    </section>
  );
}

export { ReviewsList };
