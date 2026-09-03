import api from "../lib/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/authTypes";

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);

  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);

  return response.data;
};

export const getMe = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>("auth/me");

  return response.data;
}

export const logout = async (): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("auth/logout")
  return response.data;
}