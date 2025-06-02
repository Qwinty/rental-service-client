import { useState } from "react";
import { ImageWithFallback } from "../image-with-fallback";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "unset";
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return;

    let newIndex;
    if (direction === "prev") {
      newIndex =
        selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1;
    } else {
      newIndex =
        selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1;
    }
    setSelectedImageIndex(newIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowLeft") {
      navigateImage("prev");
    } else if (event.key === "ArrowRight") {
      navigateImage("next");
    }
  };

  return (
    <>
      <div className="offer__gallery-container container">
        <div className="offer__gallery">
          {images.map((image, index) => (
            <div key={`image-${index}`} className="offer__image-wrapper">
              <ImageWithFallback
                src={image}
                alt={`${title} - фото ${index + 1}`}
                className="offer__image"
                lazy={index > 2} // Загружаем первые 3 изображения сразу
                onClick={() => openModal(index)}
              />
              <div className="offer__image-overlay">
                <button
                  className="offer__image-zoom-button"
                  onClick={() => openModal(index)}
                  type="button"
                  aria-label="Увеличить изображение"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21L16.514 16.506M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {selectedImageIndex !== null && (
        <div
          className="image-modal"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Увеличенное изображение"
        >
          <div
            className="image-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal__close"
              onClick={closeModal}
              type="button"
              aria-label="Закрыть"
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

            <button
              className="image-modal__nav image-modal__nav--prev"
              onClick={() => navigateImage("prev")}
              type="button"
              aria-label="Предыдущее изображение"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="image-modal__nav image-modal__nav--next"
              onClick={() => navigateImage("next")}
              type="button"
              aria-label="Следующее изображение"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <img
              src={images[selectedImageIndex]}
              alt={`${title} - фото ${selectedImageIndex + 1}`}
              className="image-modal__image"
            />

            <div className="image-modal__counter">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { ImageGallery };
