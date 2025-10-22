// Environment configuration
export const ENV = {
  // Backend URL for Medusa commerce
  medusaBackendUrl: __DEV__
    ? 'http://localhost:9000'
    : 'https://your-production-medusa-url.com',

  // API timeout settings
  apiTimeout: 30000,

  // Other environment variables can be added here
  isDevelopment: __DEV__,
} as const;

export type EnvConfig = typeof ENV;