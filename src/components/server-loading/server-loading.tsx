import React, { useState, useEffect } from "react";
import { useServerStatusContext } from "../../contexts/ServerStatusContext";
import "./server-loading.css";

export const ServerLoading: React.FC = () => {
  const { isAwake, isWakingUp, error, wakeUpServer } = useServerStatusContext();
  const [showLoading, setShowLoading] = useState(false);
  const [dots, setDots] = useState("");

  // Show loading screen if server is not awake or is waking up
  useEffect(() => {
    setShowLoading(!isAwake || isWakingUp);
  }, [isAwake, isWakingUp]);

  // Animated dots effect
  useEffect(() => {
    if (!showLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [showLoading]);

  // Auto-retry server wake up
  useEffect(() => {
    if (!isAwake && !isWakingUp && !error) {
      const timer = setTimeout(() => {
        wakeUpServer();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAwake, isWakingUp, error, wakeUpServer]);

  if (!showLoading) {
    return null;
  }

  const handleRetry = () => {
    wakeUpServer();
  };

  return (
    <div className="server-loading-overlay">
      <div className="server-loading-container">
        <div className="server-loading-content">
          {/* Logo/Icon */}
          <div className="server-loading-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20V18H4V6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 10H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="14" r="1" fill="currentColor" />
              <circle cx="11" cy="14" r="1" fill="currentColor" />
            </svg>
          </div>

          {/* Loading Text */}
          <h2 className="server-loading-title">
            {isWakingUp ? "Запуск сервера" : "Подключение к серверу"}
            <span className="server-loading-dots">{dots}</span>
          </h2>

          {/* Description */}
          <p className="server-loading-description">
            {isWakingUp
              ? "Сервер запускается после периода бездействия. Это может занять до 30 секунд."
              : "Проверяем доступность сервера..."}
          </p>

          {/* Progress Bar */}
          <div className="server-loading-progress">
            <div className="server-loading-progress-bar">
              <div className="server-loading-progress-fill"></div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="server-loading-error">
              <p className="server-loading-error-text">{error}</p>
              <button
                className="server-loading-retry-btn"
                onClick={handleRetry}
                disabled={isWakingUp}
              >
                Попробовать снова
              </button>
            </div>
          )}

          {/* Status Indicator */}
          <div className="server-loading-status">
            {isWakingUp && (
              <div className="server-loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
