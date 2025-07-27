// Environment Configuration
export const config = {
  // API Configuration
  API_KEY: process.env.API_KEY || '',
  API_URL: process.env.REACT_APP_API_URL || 'https://api.example.com',
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
  
  // External Services
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || '',
  
  // Validation
  isDevelopment: process.env.REACT_APP_ENVIRONMENT === 'development',
  isProduction: process.env.REACT_APP_ENVIRONMENT === 'production',
  isTest: process.env.REACT_APP_ENVIRONMENT === 'test',
};

// Validate required environment variables
export const validateEnv = (): boolean => {
  const requiredVars = ['REACT_APP_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars);
    return false;
  }
  
  return true;
};

export default config; 