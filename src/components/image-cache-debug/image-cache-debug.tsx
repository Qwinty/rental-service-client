import { useState, useEffect } from "react";
import { getImageCacheStats, clearImageCache } from "../../utils/image-cache";

interface ImageCacheDebugProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

function ImageCacheDebug({ position = "bottom-right" }: ImageCacheDebugProps) {
  const [stats, setStats] = useState({ count: 0, sizeEstimate: "0 MB" });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(getImageCacheStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    clearImageCache();
    setStats(getImageCacheStats());
  };

  const positionStyles = {
    "top-left": { top: 10, left: 10 },
    "top-right": { top: 10, right: 10 },
    "bottom-left": { bottom: 10, left: 10 },
    "bottom-right": { bottom: 10, right: 10 },
  };

  return (
    <div
      style={{
        position: "fixed",
        ...positionStyles[position],
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: isVisible ? "12px" : "6px",
        borderRadius: "6px",
        fontSize: "12px",
        cursor: "pointer",
        fontFamily: "monospace",
        minWidth: isVisible ? "200px" : "60px",
        transition: "all 0.3s ease",
      }}
      onClick={() => setIsVisible(!isVisible)}
    >
      {isVisible ? (
        <>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            📷 Image Cache
          </div>
          <div>Images: {stats.count}</div>
          <div>Size: {stats.sizeEstimate}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClearCache();
            }}
            style={{
              marginTop: "8px",
              padding: "4px 8px",
              backgroundColor: "#ff4444",
              color: "white",
              border: "none",
              borderRadius: "3px",
              fontSize: "11px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Clear Cache
          </button>
        </>
      ) : (
        <span>📷 {stats.count}</span>
      )}
    </div>
  );
}

export { ImageCacheDebug };
