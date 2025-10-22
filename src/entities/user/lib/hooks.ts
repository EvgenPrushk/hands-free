import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../api/user-api';
import { queryKeys } from '~/shared/api';
import { User, ApiResponse } from '~/shared/lib/types';

// User hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(1), // Assuming current user ID is 1
    queryFn: userAPI.getProfile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      // Update the user profile cache
      queryClient.setQueryData(queryKeys.user.profile(1), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
  });
};

export const useUserPreferences = () => {
  return useQuery({
    queryKey: queryKeys.user.preferences(1),
    queryFn: userAPI.getPreferences,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updatePreferences,
    onSuccess: (data) => {
      // Update the preferences cache
      queryClient.setQueryData(queryKeys.user.preferences(1), data);
      // Update user profile cache if it exists
      const userProfile = queryClient.getQueryData<ApiResponse<User>>(queryKeys.user.profile(1));
      if (userProfile) {
        queryClient.setQueryData(queryKeys.user.profile(1), {
          ...userProfile,
          data: {
            ...userProfile.data,
            preferences: data.data,
          },
        });
      }
    },
  });
};