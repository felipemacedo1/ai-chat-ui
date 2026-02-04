import { httpClient } from "@/shared/lib/httpClient";
import { LoginRequest, RegisterRequest } from "../dto/request";
import { AuthResponse } from "../dto/response";

const AUTH_BASE_URL = "/api/auth";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      `${AUTH_BASE_URL}/login`,
      data
    );
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      `${AUTH_BASE_URL}/register`,
      data
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await httpClient.post(`${AUTH_BASE_URL}/logout`);
  },
};
