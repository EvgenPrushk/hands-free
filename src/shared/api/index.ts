// Export all shared API functionality
export { storage } from './storage';
export { api, ApiError } from './base';
export { queryClient, persistQueryClient, restoreQueryClient, queryKeys } from './query-client';
export { apiService } from './ApiService';
export type { RequestConfig } from './ApiService';