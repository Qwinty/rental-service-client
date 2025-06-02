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

  // Создание тестового предложения
  const createTestOffer = async () => {
    if (!authResult) {
      setError("Please login first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Создаем FormData
      const formData = new FormData();

      // Базовые данные
      formData.append("title", "Тестовая квартира в центре");
      formData.append(
        "description",
        "Уютная квартира с прекрасным видом на город. Современный ремонт, все удобства."
      );
      formData.append("city", "Amsterdam");
      formData.append("type", "apartment");
      formData.append("price", "150");
      formData.append("rooms", "2");
      formData.append("guests", "4");
      formData.append("latitude", "52.3676");
      formData.append("longitude", "4.9041");
      formData.append("isPremium", "true");
      formData.append("isFavorite", "false");
      formData.append("rating", "4.5");
      formData.append(
        "features",
        JSON.stringify(["Wi-Fi", "Kitchen", "Washing machine", "Heating"])
      );

      // Создаем тестовое изображение (1x1 пиксель PNG)
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Создаем градиент для красивого фона
        const gradient = ctx.createLinearGradient(0, 0, 300, 200);
        gradient.addColorStop(0, "#4481c3");
        gradient.addColorStop(1, "#6899ce");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 200);

        // Добавляем текст
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Test Apartment", 150, 100);
        ctx.font = "14px Arial";
        ctx.fillText("Preview Image", 150, 130);
      }

      // Конвертируем canvas в blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          const previewFile = new File([blob], "preview.png", {
            type: "image/png",
          });
          const photoFile = new File([blob], "photo1.png", {
            type: "image/png",
          });

          formData.append("previewImage", previewFile);
          formData.append("photos", photoFile);

          try {
            const result = await offerApi.createOffer({
              title: "Тестовая квартира в центре",
              description:
                "Уютная квартира с прекрасным видом на город. Современный ремонт, все удобства.",
              city: "Amsterdam",
              type: "apartment",
              price: 150,
              rooms: 2,
              guests: 4,
              latitude: 52.3676,
              longitude: 4.9041,
              isPremium: true,
              features: ["Wi-Fi", "Kitchen", "Washing machine", "Heating"],
              previewImage: previewFile,
              photos: [photoFile],
            });

            console.log("Offer created:", result);
            setError("Предложение успешно создано!");
            // Обновляем список предложений
            await testOffers();
          } catch (createError) {
            setError(
              createError instanceof Error
                ? createError.message
                : "Failed to create offer"
            );
          }
        }
      }, "image/png");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create test offer"
      );
      console.error("Error creating offer:", err);
    } finally {
      setLoading(false);
    }
  };

  // Создание нескольких тестовых предложений
  const createMultipleTestOffers = async () => {
    if (!authResult) {
      setError("Please login first");
      return;
    }

    const testOffersData = [
      {
        title: "Современная студия у канала",
        city: "Amsterdam",
        type: "apartment",
        price: 95,
        description:
          "Стильная студия с видом на канал. Отличное расположение в историческом центре.",
        latitude: 52.3738,
        longitude: 4.891,
      },
      {
        title: "Уютный дом с садом",
        city: "Amsterdam",
        type: "house",
        price: 220,
        description:
          "Просторный дом с приватным садом. Идеально для семейного отдыха.",
        latitude: 52.3676,
        longitude: 4.9041,
      },
      {
        title: "Комната в центре города",
        city: "Amsterdam",
        type: "room",
        price: 65,
        description: "Комфортная комната в самом сердце Амстердама. Все рядом!",
        latitude: 52.3702,
        longitude: 4.8952,
      },
    ];

    for (const offerData of testOffersData) {
      try {
        setLoading(true);

        // Создаем уникальное изображение для каждого предложения
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Случайный цвет для каждого предложения
          const colors = [
            "#4481c3",
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];

          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 300, 200);

          ctx.fillStyle = "white";
          ctx.font = "16px Arial";
          ctx.textAlign = "center";
          ctx.fillText(offerData.title, 150, 90);
          ctx.font = "12px Arial";
          ctx.fillText(`€${offerData.price}/night`, 150, 120);
          ctx.fillText(offerData.type, 150, 140);
        }

        await new Promise((resolve) => {
          canvas.toBlob(async (blob) => {
            if (blob) {
              const previewFile = new File(
                [blob],
                `preview-${Date.now()}.png`,
                { type: "image/png" }
              );
              const photoFile = new File([blob], `photo-${Date.now()}.png`, {
                type: "image/png",
              });

              await offerApi.createOffer({
                title: offerData.title,
                description: offerData.description,
                city: offerData.city,
                type: offerData.type,
                price: offerData.price,
                rooms: 2,
                guests: 4,
                latitude: offerData.latitude,
                longitude: offerData.longitude,
                isPremium: Math.random() > 0.5,
                features: ["Wi-Fi", "Kitchen", "Heating"],
                previewImage: previewFile,
                photos: [photoFile],
              });
            }
            resolve(true);
          }, "image/png");
        });

        console.log(`Created offer: ${offerData.title}`);
      } catch (err) {
        console.error(`Failed to create offer ${offerData.title}:`, err);
      }
    }

    setLoading(false);
    setError("Все тестовые предложения созданы!");
    await testOffers();
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
        <h3>3. Создание тестовых предложений</h3>
        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={createTestOffer}
            disabled={loading || !authResult}
            style={{ marginRight: "10px" }}
          >
            Создать одно предложение
          </button>
          <button
            onClick={createMultipleTestOffers}
            disabled={loading || !authResult}
          >
            Создать несколько предложений
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "#666" }}>
          ⚠️ Сначала нужно авторизоваться!
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>4. Тест отзывов</h3>
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
