import ApiService, { API_BASE_URL } from "./api";
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  AuthUser,
} from "../types/offer";

class UserApi extends ApiService {
  constructor() {
    super(API_BASE_URL);
  }

  // Регистрация пользователя
  async register(userData: RegisterData): Promise<AuthResponse> {
    const formData = new FormData();

    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("userType", userData.userType);

    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }

    return this.post<AuthResponse>("/users/register", formData);
  }

  // Вход пользователя
  async login(loginData: LoginData): Promise<AuthResponse> {
    return this.post<AuthResponse>("/users/login", loginData);
  }

  // Проверка авторизации
  async checkAuth(): Promise<AuthUser> {
    return this.get<AuthUser>("/users/login");
  }

  // Выход пользователя
  async logout(): Promise<void> {
    await this.delete<void>("/users/logout");
    localStorage.removeItem("token");
  }

  // Получить информацию о пользователе
  async getUserInfo(userId: number): Promise<AuthUser> {
    return this.get<AuthUser>(`/users/${userId}`);
  }
}

export default new UserApi();
