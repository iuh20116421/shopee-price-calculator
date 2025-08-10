// Export axios client
export { default as axiosClient } from './axiosClient';

// Export services
export * from '../services';

// Utility functions for API handling
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return !error?.response && error?.request;
};

export const isServerError = (error: any): boolean => {
  return error?.response?.status >= 500;
};

export const isClientError = (error: any): boolean => {
  return error?.response?.status >= 400 && error?.response?.status < 500;
};

// Token management utilities
export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const removeStoredToken = (): void => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// API status checker
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const { default: axiosClient } = await import('./axiosClient');
    await axiosClient.get('/health');
    return true;
  } catch {
    return false;
  }
};
