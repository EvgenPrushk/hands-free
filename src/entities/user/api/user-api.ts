import { api } from '~/shared/api';
import { ApiResponse } from '~/shared/lib/types';
import { User } from '../model/types';

export const userAPI = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return api.get<ApiResponse<User>>('/user/profile');
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return api.patch<ApiResponse<User>>('/user/profile', userData);
  },

  // Get user preferences
  getPreferences: async (): Promise<ApiResponse<User['preferences']>> => {
    return api.get<ApiResponse<User['preferences']>>('/user/preferences');
  },

  // Update user preferences
  updatePreferences: async (preferences: Partial<User['preferences']>): Promise<ApiResponse<User['preferences']>> => {
    return api.patch<ApiResponse<User['preferences']>>('/user/preferences', preferences);
  },
};