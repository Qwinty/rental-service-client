import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../services/api";

export interface ServerStatus {
  isAwake: boolean;
  isWakingUp: boolean;
  lastPingTime: number | null;
  error: string | null;
}

const PING_INTERVAL = 10000; // 10 seconds
const WAKE_UP_TIMEOUT = 45000; // 45 seconds
const RETRY_ATTEMPTS = 5;

export const useServerStatus = () => {
  const [status, setStatus] = useState<ServerStatus>({
    isAwake: false,
    isWakingUp: false,
    lastPingTime: null,
    error: null,
  });

  const pingServer = useCallback(
    async (isManualWakeUp = false): Promise<boolean> => {
      if (isManualWakeUp) {
        setStatus((prev) => ({ ...prev, isWakingUp: true, error: null }));
      }

      let attempts = 0;

      while (attempts < RETRY_ATTEMPTS) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            WAKE_UP_TIMEOUT
          );

          const response = await fetch(`${API_BASE_URL}/health`, {
            method: "GET",
            signal: controller.signal,
            headers: {
              "Cache-Control": "no-cache",
            },
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            setStatus({
              isAwake: true,
              isWakingUp: false,
              lastPingTime: Date.now(),
              error: null,
            });
            return true;
          }
        } catch (error) {
          attempts++;
          console.warn(`Server ping attempt ${attempts} failed:`, error);

          if (attempts < RETRY_ATTEMPTS) {
            // Wait before retry (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, attempts))
            );
          }
        }
      }

      // All attempts failed
      const errorMessage = isManualWakeUp
        ? "Не удалось разбудить сервер. Попробуйте еще раз."
        : "Сервер недоступен";

      setStatus((prev) => ({
        ...prev,
        isAwake: false,
        isWakingUp: false,
        error: errorMessage,
      }));

      return false;
    },
    []
  );

  const wakeUpServer = useCallback(() => {
    return pingServer(true);
  }, [pingServer]);

  // Initial server check
  useEffect(() => {
    pingServer();
  }, [pingServer]);

  // Periodic ping to keep server awake
  useEffect(() => {
    if (!status.isAwake) return;

    const interval = setInterval(() => {
      pingServer();
    }, PING_INTERVAL);

    return () => clearInterval(interval);
  }, [status.isAwake, pingServer]);

  return {
    ...status,
    wakeUpServer,
    pingServer: () => pingServer(false),
  };
};
