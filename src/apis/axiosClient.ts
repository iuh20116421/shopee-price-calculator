import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AUTH_TOKEN_KEY } from '../constants/accounts';

// Get access token from localStorage
const getAccessToken = (): string => {
  try {
    const authData = localStorage.getItem(AUTH_TOKEN_KEY);
    return authData || '';
  } catch (error) {
    console.error('Error getting access token:', error);
    return '';
  }
};

// Remove access token and redirect to login
const removeAuthAndRedirect = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('user_info');
  
  // Only redirect if not already on login page
  if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/dang-nhap')) {
    window.location.href = '/login';
  }
};

// Serialize params function (replaces query-string)
const serializeParams = (params: Record<string, any>): string => {
  const urlParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      urlParams.append(key, String(params[key]));
    }
  });
  return urlParams.toString();
};

// Create axios instance
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  paramsSerializer: (params) => serializeParams(params),
});

// Request interceptor
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const accessToken = getAccessToken();
    
    if (config.headers) {
      // Add authorization header if token exists
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers['x-auth-token'] = accessToken;
      }
      
      // Add additional headers
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      
      // Add debug info in development
      if (process.env.REACT_APP_ENVIRONMENT === 'development') {
        config.headers['X-Debug-Mode'] = 'true';
      }
    }

    // Log request in development
    if (process.env.REACT_APP_ENVIRONMENT === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.REACT_APP_ENVIRONMENT === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
      });
    }

    // Return response data directly for successful requests
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    // Handle unexpected successful responses
    throw new Error(`Unexpected response format: ${response.status}`);
  },
  (error) => {
    // Log error in development
    if (process.env.REACT_APP_ENVIRONMENT === 'development') {
      console.error('❌ API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          url: error.config?.url,
          data: error.config?.data,
        },
      });
    }

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle authentication errors
      if (status === 401) {
        console.warn('🔐 Authentication failed - redirecting to login');
        removeAuthAndRedirect();
        return Promise.reject(new Error('Authentication required'));
      }
      
      // Handle forbidden access
      if (status === 403) {
        console.warn('🚫 Access forbidden');
        return Promise.reject(new Error('Access forbidden'));
      }
      
      // Handle not found
      if (status === 404) {
        console.warn('🔍 Resource not found');
        return Promise.reject(new Error('Resource not found'));
      }
      
      // Handle server errors
      if (status >= 500) {
        console.error('🔥 Server error');
        return Promise.reject(new Error('Server error occurred'));
      }
      
      // Handle other client errors
      if (status >= 400 && status < 500) {
        const errorMessage = data?.message || data?.error || 'Client error occurred';
        return Promise.reject(new Error(errorMessage));
      }
      
      // Return the error response data for handled errors
      return Promise.reject(data || error.response);
    }
    
    // Handle network errors
    if (error.request) {
      console.error('🌐 Network error:', error.request);
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    // Handle other errors
    console.error('⚠️ Unknown error:', error.message);
    return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
  }
);

export default axiosClient;
