import axiosClient from '../apis/axiosClient';
import { User } from '../types/api';

export interface UpdateUserRequest {
  name?: string;
  shopLink?: string;
  role?: 'user' | 'admin';
}

export class UserService {
  // Get user profile (same as AuthService.getProfile, but for consistency)
  static async getProfile(): Promise<{ success: true; user: User }> {
    try {
      const response = await axiosClient.get('/auth/profile') as { success: true; user: User };
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user profile');
    }
  }

  // Update user profile (if BE supports this endpoint later)
  static async updateProfile(data: UpdateUserRequest): Promise<{ success: true; user: User }> {
    try {
      const response = await axiosClient.put('/auth/profile', data) as { success: true; user: User };
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }
}

export default UserService;
