import axiosClient from '../apis/axiosClient';
import RecaptchaService from './recaptchaService';

// Send OTP for registration
export interface SendOTPRegisterRequest {
  phone: string;
}

export interface SendOTPResponse {
  success: true;
  message: string;
  sessionInfo: string;
  expiresIn: number; // seconds
}

// Verify OTP for registration
export interface VerifyOTPRegisterRequest {
  phone: string;
  sessionInfo: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: true;
  message: string;
  isVerified: boolean;
  phoneNumber: string;
}

// Send OTP for forgot password
export interface SendOTPForgotPasswordRequest {
  phone: string;
}

// Verify OTP for forgot password
export interface VerifyOTPForgotPasswordRequest {
  phone: string;
  sessionInfo: string;
  otp: string;
}

export interface VerifyOTPForgotPasswordResponse {
  success: true;
  message: string;
  resetToken: string;
  userId: string;
  phoneNumber: string;
}

export class OTPService {
  // Send OTP for registration
  static async sendOTPForRegister(data: SendOTPRegisterRequest): Promise<SendOTPResponse> {
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await RecaptchaService.getOTPToken();
      
      // Send request with reCAPTCHA token
      const response = await axiosClient.post('/otp/send-register', {
        ...data,
        recaptchaToken
      }) as SendOTPResponse;
      
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send OTP for registration');
    }
  }

  // Verify OTP for registration
  static async verifyOTPForRegister(data: VerifyOTPRegisterRequest): Promise<VerifyOTPResponse> {
    try {
      const response = await axiosClient.post('/otp/verify-register', data) as VerifyOTPResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify OTP for registration');
    }
  }

  // Send OTP for forgot password
  static async sendOTPForForgotPassword(data: SendOTPForgotPasswordRequest): Promise<SendOTPResponse> {
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await RecaptchaService.getOTPToken();
      
      // Send request with reCAPTCHA token
      const response = await axiosClient.post('/otp/send-forgot-password', {
        ...data,
        recaptchaToken
      }) as SendOTPResponse;
      
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send OTP for forgot password');
    }
  }

  // Verify OTP for forgot password
  static async verifyOTPForForgotPassword(data: VerifyOTPForgotPasswordRequest): Promise<VerifyOTPForgotPasswordResponse> {
    try {
      const response = await axiosClient.post('/otp/verify-forgot-password', data) as VerifyOTPForgotPasswordResponse;
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify OTP for forgot password');
    }
  }
}

export default OTPService;
