import type { Review } from "../../types/offer";

interface ReviewProps {
  review: Review;
}

function ReviewComponent({ review }: ReviewProps) {
  const { user, rating, comment, date } = review;

  // Рассчитываем ширину звездочек для рейтинга (рейтинг от 0 до 5, нужно получить проценты)
  const ratingWidth = `${Math.round(rating) * 20}%`;

  // Форматируем дату
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={user.avatarUrl}
            width="54"
            height="54"
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{user.name}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: ratingWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{comment}</p>
        <time className="reviews__time" dateTime={date}>
          {formatDate(date)}
        </time>
      </div>
    </li>
  );
}

export { ReviewComponent };
