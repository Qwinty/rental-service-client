import { useState, useRef, useEffect } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  fallbackSrc?: string;
  lazy?: boolean;
  onClick?: () => void;
}

function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackSrc = "/img/placeholder.jpg",
  lazy = true,
  onClick,
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(lazy ? "" : src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const mainDivRef = useRef<HTMLDivElement>(null); // Ref for the main wrapper div

  useEffect(() => {
    if (!lazy) {
      setCurrentSrc(src);
      // For non-lazy images, if src is already there, we might not need to show loading for long
      // or depend on onLoad. But for consistency, let's keep setIsLoading(true) initially.
      return;
    }

    let observer: IntersectionObserver | null = null;
    const currentMainDiv = mainDivRef.current; // Capture current value for cleanup

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsLoading(true); // Ensure loading is true when we start loading src
        setCurrentSrc(src);
        if (observer && currentMainDiv) {
          observer.unobserve(currentMainDiv); // Stop observing once intersected
        }
      }
    };

    if (currentMainDiv) {
      observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
      observer.observe(currentMainDiv);
    }

    return () => {
      if (observer && currentMainDiv) {
        observer.unobserve(currentMainDiv);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [src, lazy]); // mainDivRef.current is stable, no need to include as dependency

  useEffect(() => {
    // Reset isLoading to true when src/currentSrc changes,
    // unless it's the initial empty string for lazy loading.
    if (currentSrc && currentSrc !== fallbackSrc) {
      setIsLoading(true);
      setHasError(false);
    } else if (!currentSrc && lazy) {
      // Initial state for lazy loading, placeholder should be visible
      setIsLoading(true);
      setHasError(false);
    }
  }, [currentSrc, lazy, fallbackSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true); // Keep it true to indicate an issue occurred
      setIsLoading(true); // We are now trying to load the fallback
    } else {
      // Fallback also failed or no fallbackSrc
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <div
      ref={mainDivRef}
      className={`image-with-fallback ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", width, height }}
    >
      {isLoading &&
        (!currentSrc || currentSrc === src || currentSrc === fallbackSrc) && (
          <div
            className="image-placeholder"
            style={{ width: "100%", height: "100%" }}
          >
            <div
              className="image-skeleton"
              style={{ width: "100%", height: "100%" }}
            ></div>
          </div>
        )}

      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          // width and height props are applied to the wrapper div for layout control
          // img tag itself will fill the wrapper
          className={className} // Apply className to img as well if needed for specific img styling
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: isLoading ? "none" : "block",
            opacity: hasError && currentSrc === fallbackSrc ? 0.7 : 1, // Dim if showing fallback
            width: "100%",
            height: "100%",
            objectFit: "cover", // Ensure image covers the area
          }}
        />
      )}

      {hasError && !isLoading && (
        <div
          className="image-error-overlay"
          style={{ width: "100%", height: "100%" }}
        >
          <span>Изображение недоступно</span>
        </div>
      )}
    </div>
  );
}

export { ImageWithFallback };
