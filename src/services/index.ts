// Export all services
export { AuthService } from './authService';
export { UserService } from './userService';
export { OTPService } from './otpService';

// Export types
export type {
  UpdateUserRequest,
} from './userService';

export type {
  SendOTPRegisterRequest,
  SendOTPResponse,
  VerifyOTPRegisterRequest,
  VerifyOTPResponse,
  SendOTPForgotPasswordRequest,
  VerifyOTPForgotPasswordRequest,
  VerifyOTPForgotPasswordResponse,
} from './otpService';

// Re-export common types
export type {
  User,
  LoginRequest,
  CreateUserRequest,
  AuthResponse,
  UserProfileResponse,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  StoredAuthData,
} from '../types/api';
