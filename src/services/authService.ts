import axiosClient from '../apis/axiosClient';
import { 
  LoginRequest, 
  CreateUserRequest, 
  AuthResponse, 
  UserProfileResponse,
  ApiResponse 
} from '../types/api';

export class AuthService {
  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axiosClient.post('/auth/login', data) as AuthResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Register new user
  static async register(data: CreateUserRequest): Promise<AuthResponse> {
    try {
      const response = await axiosClient.post('/auth/register', data) as AuthResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Get user profile
  static async getProfile(): Promise<UserProfileResponse> {
    try {
      const response = await axiosClient.get('/auth/profile') as UserProfileResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user profile');
    }
  }

  // Refresh token (if backend supports it)
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await axiosClient.post('/auth/refresh') as AuthResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to refresh token');
    }
  }

  // Logout (if backend supports token blacklisting)
  static async logout(): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post('/auth/logout') as ApiResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Verify token
  static async verifyToken(): Promise<ApiResponse> {
    try {
      const response = await axiosClient.get('/auth/verify') as ApiResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Token verification failed');
    }
  }

  // Change password
  static async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    try {
      const response = await axiosClient.put('/auth/change-password', data) as ApiResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Password change failed');
    }
  }

  // Forgot password
  static async forgotPassword(phone: string): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post('/auth/forgot-password', { phone }) as ApiResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset password request');
    }
  }

  // Reset password
  static async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    try {
      const response = await axiosClient.post('/auth/reset-password', data) as ApiResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  }
}

export default AuthService;
