const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Server status detector
let serverWakeUpInProgress = false;
let serverStatusCallbacks: Array<(isAwake: boolean) => void> = [];

export const subscribeToServerStatus = (
  callback: (isAwake: boolean) => void
) => {
  serverStatusCallbacks.push(callback);
  return () => {
    serverStatusCallbacks = serverStatusCallbacks.filter(
      (cb) => cb !== callback
    );
  };
};

const notifyServerStatusChange = (isAwake: boolean) => {
  serverStatusCallbacks.forEach((callback) => callback(isAwake));
};

// Check if error indicates server cold start
const isServerColdStartError = (error: Error): boolean => {
  const coldStartIndicators = [
    "fetch",
    "network",
    "ECONNREFUSED",
    "CONNECTION_REFUSED",
    "ERR_CONNECTION_REFUSED",
    "Failed to fetch",
  ];

  return coldStartIndicators.some((indicator) =>
    error.message.toLowerCase().includes(indicator.toLowerCase())
  );
};

// Attempt to wake up the server
const attemptServerWakeUp = async (retries = 3): Promise<boolean> => {
  if (serverWakeUpInProgress) {
    return false;
  }

  serverWakeUpInProgress = true;
  notifyServerStatusChange(false);

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}/health`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (response.ok) {
        serverWakeUpInProgress = false;
        notifyServerStatusChange(true);
        return true;
      }
    } catch (error) {
      console.warn(`Server wake-up attempt ${i + 1} failed:`, error);

      if (i < retries - 1) {
        // Wait with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000)
        );
      }
    }
  }

  serverWakeUpInProgress = false;
  return false;
};

// Базовый класс для работы с API
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {};

    // Only set Content-Type if not already provided in options.headers
    if (!options.headers || !("Content-Type" in options.headers)) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Remove Content-Type header for FormData (indicated by special value)
    if (
      config.headers &&
      (config.headers as any)["Content-Type"] === "FORMDATA"
    ) {
      delete (config.headers as any)["Content-Type"];
    }

    // Добавляем токен авторизации если он есть
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Network error" }));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      // Server is responsive
      notifyServerStatusChange(true);
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);

      // Check if this might be a server cold start
      if (error instanceof Error && isServerColdStartError(error)) {
        console.log(
          "Possible server cold start detected, attempting wake-up..."
        );

        // Attempt to wake up the server
        const wakeUpSuccessful = await attemptServerWakeUp();

        if (wakeUpSuccessful) {
          // Retry the original request
          console.log(
            "Server wake-up successful, retrying original request..."
          );
          try {
            const retryResponse = await fetch(url, config);
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          } catch (retryError) {
            console.error("Retry after wake-up failed:", retryError);
          }
        }
      }

      throw error;
    }
  }

  // GET запрос
  protected get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "GET" });
  }

  // POST запрос
  protected post<T>(
    endpoint: string,
    data?: FormData | Record<string, string | number | boolean>
  ): Promise<T> {
    const config: RequestInit = { method: "POST" };

    if (data) {
      if (data instanceof FormData) {
        config.body = data;
        // Используем специальное значение для указания FormData
        config.headers = { "Content-Type": "FORMDATA" };
      } else {
        config.body = JSON.stringify(data);
        // Content-Type для JSON будет установлен в makeRequest
      }
    }

    return this.makeRequest<T>(endpoint, config);
  }

  // PUT запрос
  protected put<T>(
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE запрос
  protected delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" });
  }
}

export default ApiService;
export { API_BASE_URL };
