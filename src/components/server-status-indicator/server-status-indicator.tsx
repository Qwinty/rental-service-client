import React from "react";
import { useServerStatusContext } from "../../contexts/ServerStatusContext";
import "./server-status-indicator.css";

export const ServerStatusIndicator: React.FC = () => {
  const { isAwake, isWakingUp, error, wakeUpServer } = useServerStatusContext();

  // Don't show indicator if everything is fine
  if (isAwake && !isWakingUp && !error) {
    return null;
  }

  const getStatusText = () => {
    if (isWakingUp) return "Запуск сервера...";
    if (error) return "Ошибка соединения";
    if (!isAwake) return "Сервер недоступен";
    return "Подключение...";
  };

  const getStatusClass = () => {
    if (isWakingUp) return "status-waking";
    if (error) return "status-error";
    return "status-disconnected";
  };

  const handleClick = () => {
    if (error || !isAwake) {
      wakeUpServer();
    }
  };

  return (
    <div
      className={`server-status-indicator ${getStatusClass()}`}
      onClick={handleClick}
      title={
        error ? "Нажмите для повторной попытки подключения" : "Статус сервера"
      }
    >
      <div className="status-dot"></div>
      <span className="status-text">{getStatusText()}</span>
      {(error || !isAwake) && !isWakingUp && (
        <button className="retry-button" onClick={handleClick}>
          ↻
        </button>
      )}
    </div>
  );
};
