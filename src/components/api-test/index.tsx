import { useState } from "react";
import { offerApi, userApi, reviewApi } from "../../services";
import type { OfferList, AuthResponse, ReviewList } from "../../types/offer";

const ApiTest = () => {
  const [offers, setOffers] = useState<OfferList>([]);
  const [reviews, setReviews] = useState<ReviewList>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authResult, setAuthResult] = useState<AuthResponse | null>(null);

  const testOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await offerApi.getAllOffers();
      setOffers(data);
      console.log("Offers loaded:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load offers");
      console.error("Error loading offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userApi.login({
        email: "testuser@email.com",
        password: "testuser1",
      });
      setAuthResult(result);
      localStorage.setItem("token", result.token);
      console.log("Auth successful:", result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testReviews = async () => {
    if (offers.length === 0) {
      setError("Load offers first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await reviewApi.getReviewsByOfferId(offers[0].id);
      setReviews(data);
      console.log("Reviews loaded:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>API Connection Test</h1>
      <p>Тестирование соединения между клиентом и сервером.</p>

      {loading && <p>Loading...</p>}
      {error && (
        <p
          style={{
            color:
              error.startsWith("Предложение") ||
              error.startsWith("Все тестовые")
                ? "green"
                : "red",
          }}
        >
          {error}
        </p>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h3>1. Тест API предложений</h3>
        <button onClick={testOffers} disabled={loading}>
          Test Offers API
        </button>
        <p>Загружено предложений: {offers.length}</p>
        {offers.length > 0 && (
          <ul>
            {offers.map((offer) => (
              <li key={offer.id}>
                {offer.title} - {offer.price}€ в {offer.city.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>2. Тест авторизации</h3>
        <button onClick={testAuth} disabled={loading}>
          Test Auth API
        </button>
        {authResult && (
          <p>
            Authenticated as: {authResult.user.username} (
            {authResult.user.email})
          </p>
        )}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>3. Тест отзывов</h3>
        <button onClick={testReviews} disabled={loading || offers.length === 0}>
          Test Reviews API
        </button>
        <p>Loaded {reviews.length} reviews</p>
        {reviews.length > 0 && (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                {review.user.name}: {review.comment} ({review.rating}/5)
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
