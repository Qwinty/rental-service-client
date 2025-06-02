import { useState } from "react";
import type { ChangeEvent, FormEvent, JSX } from "react";

interface CommentFormProps {
  onSubmit?: (comment: string, rating: number) => Promise<void> | void;
}

type SubmissionStatus = "idle" | "loading" | "success" | "error";

function CommentForm({ onSubmit }: CommentFormProps): JSX.Element {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCommentChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(evt.target.value);
  };

  const handleRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRating(Number(evt.target.value));
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!onSubmit) return;

    setSubmissionStatus("loading");
    setErrorMessage("");

    try {
      await onSubmit(comment, rating);
      setSubmissionStatus("success");
      // Очищаем форму после успешной отправки
      setComment("");
      setRating(0);
    } catch (error) {
      setSubmissionStatus("error");

      // Проверяем, является ли это ошибкой авторизации
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again.";
      if (
        errorMsg.toLowerCase().includes("logged in") ||
        errorMsg.toLowerCase().includes("unauthorized")
      ) {
        setErrorMessage(
          "Please log in to submit a review. You need to be authenticated to leave feedback."
        );
      } else {
        setErrorMessage(errorMsg);
      }
    }
  };

  const closeModal = () => {
    setSubmissionStatus("idle");
    setErrorMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const isFormValid =
    comment.length >= 40 && comment.length <= 300 && rating > 0;

  return (
    <>
      <form
        className="reviews__form form"
        action="#"
        method="post"
        onSubmit={handleSubmit}
      >
        <label className="reviews__label form__label" htmlFor="review">
          Your review
        </label>
        <div className="reviews__rating-form form__rating">
          <input
            className="form__rating-input visually-hidden"
            name="rating"
            value="5"
            id="5-stars"
            type="radio"
            checked={rating === 5}
            onChange={handleRatingChange}
          />
          <label
            htmlFor="5-stars"
            className="reviews__rating-label form__rating-label"
            title="perfect"
          >
            <svg className="form__star-image" width="37" height="33">
              <use href="#icon-star"></use>
            </svg>
          </label>

          <input
            className="form__rating-input visually-hidden"
            name="rating"
            value="4"
            id="4-stars"
            type="radio"
            checked={rating === 4}
            onChange={handleRatingChange}
          />
          <label
            htmlFor="4-stars"
            className="reviews__rating-label form__rating-label"
            title="good"
          >
            <svg className="form__star-image" width="37" height="33">
              <use href="#icon-star"></use>
            </svg>
          </label>

          <input
            className="form__rating-input visually-hidden"
            name="rating"
            value="3"
            id="3-stars"
            type="radio"
            checked={rating === 3}
            onChange={handleRatingChange}
          />
          <label
            htmlFor="3-stars"
            className="reviews__rating-label form__rating-label"
            title="not bad"
          >
            <svg className="form__star-image" width="37" height="33">
              <use href="#icon-star"></use>
            </svg>
          </label>

          <input
            className="form__rating-input visually-hidden"
            name="rating"
            value="2"
            id="2-stars"
            type="radio"
            checked={rating === 2}
            onChange={handleRatingChange}
          />
          <label
            htmlFor="2-stars"
            className="reviews__rating-label form__rating-label"
            title="badly"
          >
            <svg className="form__star-image" width="37" height="33">
              <use href="#icon-star"></use>
            </svg>
          </label>

          <input
            className="form__rating-input visually-hidden"
            name="rating"
            value="1"
            id="1-star"
            type="radio"
            checked={rating === 1}
            onChange={handleRatingChange}
          />
          <label
            htmlFor="1-star"
            className="reviews__rating-label form__rating-label"
            title="terribly"
          >
            <svg className="form__star-image" width="37" height="33">
              <use href="#icon-star"></use>
            </svg>
          </label>
        </div>
        <textarea
          className="reviews__textarea form__textarea"
          id="review"
          name="review"
          placeholder="Tell how was your stay, what you like and what can be improved"
          value={comment}
          onChange={handleCommentChange}
          disabled={submissionStatus === "loading"}
        ></textarea>
        <div className="reviews__button-wrapper">
          <p className="reviews__help">
            To submit review please make sure to set{" "}
            <span className="reviews__star">rating</span> and describe your stay
            with at least <b className="reviews__text-amount">40 characters</b>.
          </p>
          <button
            className="reviews__submit form__submit button"
            type="submit"
            disabled={!isFormValid || submissionStatus === "loading"}
          >
            {submissionStatus === "loading" ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {submissionStatus === "success" && (
        <div
          className="review-modal"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Review submitted successfully"
        >
          <div
            className="review-modal__content review-modal__content--success"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="review-modal__close"
              onClick={closeModal}
              type="button"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="review-modal__icon review-modal__icon--success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="review-modal__title">
              Review Submitted Successfully!
            </h3>
            <p className="review-modal__message">
              Thank you for your feedback. Your review has been submitted and
              will be visible shortly.
            </p>

            <button
              className="review-modal__button button"
              onClick={closeModal}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {submissionStatus === "error" && (
        <div
          className="review-modal"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Review submission failed"
        >
          <div
            className="review-modal__content review-modal__content--error"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="review-modal__close"
              onClick={closeModal}
              type="button"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="review-modal__icon review-modal__icon--error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="review-modal__title">Review Submission Failed</h3>
            <p className="review-modal__message">{errorMessage}</p>

            <div className="review-modal__buttons">
              <button
                className="review-modal__button button"
                onClick={closeModal}
                type="button"
              >
                Try Again
              </button>
              <button
                className="review-modal__button review-modal__button--secondary"
                onClick={() => {
                  // If it's an auth error, redirect to login
                  if (errorMessage.toLowerCase().includes("log in")) {
                    window.location.href = "/login";
                  } else {
                    closeModal();
                  }
                }}
                type="button"
              >
                {errorMessage.toLowerCase().includes("log in")
                  ? "Go to Login"
                  : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { CommentForm };
