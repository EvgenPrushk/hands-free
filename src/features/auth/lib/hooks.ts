import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/auth-api';

// Authentication hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    onSuccess: () => {
      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      // Invalidate all queries to fetch user data
      queryClient.invalidateQueries();
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
};