import { api } from '~/shared/api';
import { ApiResponse } from '~/shared/lib/types';
import { User } from '~/entities/user';

// Authentication API (for actual login/register)
export const authAPI = {
  // Login
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    });
  },

  // Register
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    return api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return api.post<ApiResponse<{ token: string }>>('/auth/refresh');
  },

  // Logout
  logout: async (): Promise<ApiResponse<void>> => {
    return api.post<ApiResponse<void>>('/auth/logout');
  },
};