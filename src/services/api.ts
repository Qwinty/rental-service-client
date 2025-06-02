const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
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
