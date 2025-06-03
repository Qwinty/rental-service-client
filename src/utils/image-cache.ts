// Image cache management utilities
const CACHE_PREFIX = "img_cache_";

export function clearImageCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    cacheKeys.forEach((key) => localStorage.removeItem(key));
    console.log(`Cleared ${cacheKeys.length} cached images from localStorage`);
  } catch (error) {
    console.warn("Error clearing image cache:", error);
  }
}

export function getImageCacheStats(): { count: number; sizeEstimate: string } {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));

    // Estimate size
    let totalSize = 0;
    cacheKeys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });

    // Convert to readable format
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

    return {
      count: cacheKeys.length,
      sizeEstimate: `${sizeInMB} MB`,
    };
  } catch (error) {
    console.warn("Error getting cache stats:", error);
    return { count: 0, sizeEstimate: "0 MB" };
  }
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map((src) => preloadImage(src)));
}
