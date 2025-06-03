import { useState, useRef, useEffect, useCallback } from "react";

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

// Simple image cache using Map for memory and localStorage for persistence
const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

// Cache utilities
const CACHE_PREFIX = "img_cache_";
const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(src: string): string {
  return btoa(src).replace(/[/+=]/g, "_");
}

function isValidCacheEntry(timestamp: number): boolean {
  return Date.now() - timestamp < MAX_AGE;
}

function getCachedFromStorage(key: string): string | null {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (isValidCacheEntry(parsed.timestamp)) {
        return parsed.dataUrl;
      } else {
        localStorage.removeItem(CACHE_PREFIX + key);
      }
    }
  } catch (error) {
    console.warn("Error reading from cache:", error);
  }
  return null;
}

function saveToStorage(key: string, dataUrl: string): void {
  try {
    const data = { dataUrl, timestamp: Date.now() };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch (error) {
    console.warn("Error saving to cache:", error);
  }
}

function imageToDataUrl(img: HTMLImageElement): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch (error) {
    console.warn("Error converting image to data URL:", error);
    return "";
  }
}

async function loadImageWithCache(src: string): Promise<HTMLImageElement> {
  const key = getCacheKey(src);

  // Check memory cache
  if (imageCache.has(key)) {
    return Promise.resolve(imageCache.get(key)!);
  }

  // Check if already loading
  if (loadingPromises.has(key)) {
    return loadingPromises.get(key)!;
  }

  // Check localStorage
  const cachedDataUrl = getCachedFromStorage(key);
  if (cachedDataUrl) {
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(key, img);
        resolve(img);
      };
      img.onerror = () => {
        localStorage.removeItem(CACHE_PREFIX + key);
        reject(new Error("Cached image failed to load"));
      };
      img.src = cachedDataUrl;
    });

    loadingPromises.set(key, promise);
    promise.finally(() => loadingPromises.delete(key));
    return promise;
  }

  // Load from network
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const dataUrl = imageToDataUrl(img);
        if (dataUrl) {
          saveToStorage(key, dataUrl);
        }
        imageCache.set(key, img);
        resolve(img);
      } catch (error) {
        console.warn("Error caching image:", error);
        resolve(img);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });

  loadingPromises.set(key, promise);
  promise.finally(() => loadingPromises.delete(key));
  return promise;
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
  const [cachedImageSrc, setCachedImageSrc] = useState<string>("");
  const mainDivRef = useRef<HTMLDivElement>(null);

  const loadImageFromCache = useCallback(
    async (imageSrc: string) => {
      try {
        setIsLoading(true);
        setHasError(false);

        const img = await loadImageWithCache(imageSrc);
        setCachedImageSrc(img.src);
        setIsLoading(false);
      } catch (error) {
        console.warn("Failed to load image:", imageSrc, error);
        if (imageSrc !== fallbackSrc && fallbackSrc) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        } else {
          setIsLoading(false);
          setHasError(true);
        }
      }
    },
    [fallbackSrc]
  );

  useEffect(() => {
    if (!lazy) {
      setCurrentSrc(src);
      return;
    }

    let observer: IntersectionObserver | null = null;
    const currentMainDiv = mainDivRef.current;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setCurrentSrc(src);
        if (observer && currentMainDiv) {
          observer.unobserve(currentMainDiv);
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
  }, [src, lazy]);

  useEffect(() => {
    if (currentSrc && currentSrc !== "") {
      loadImageFromCache(currentSrc);
    } else if (!currentSrc && lazy) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [currentSrc, lazy, loadImageFromCache]);

  return (
    <div
      ref={mainDivRef}
      className={`image-with-fallback ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", width, height }}
    >
      {isLoading && (!currentSrc || !cachedImageSrc) && (
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

      {cachedImageSrc && (
        <img
          src={cachedImageSrc}
          alt={alt}
          className={className}
          style={{
            display: isLoading ? "none" : "block",
            opacity: hasError && currentSrc === fallbackSrc ? 0.7 : 1,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {hasError && !isLoading && !cachedImageSrc && (
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
