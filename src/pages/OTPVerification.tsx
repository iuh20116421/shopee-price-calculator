import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { OTPService } from '../services/otpService';
import { AuthService } from '../services';
import { showToast } from '../utils/toast';
import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '../constants/accounts';
import type { CreateUserRequest } from '../services';

interface LocationState {
  phone: string;
  sessionInfo: string;
  expiresIn: number;
  type: 'register' | 'forgot-password';
  registrationData?: CreateUserRequest;
}

const OTPVerification: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Redirect if no state
  useEffect(() => {
    if (!state || !state.phone || !state.sessionInfo) {
      navigate('/login');
    }
  }, [state, navigate]);

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(state?.expiresIn || 300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otp = otpCode.join('');
    if (otp.length !== 6) {
      showToast(t('otp.enterFullCode'), 'error');
      return;
    }

    setIsVerifying(true);

    // Add 1 second delay to show loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (state.type === 'register') {
        // Verify OTP for registration
        const verifyResponse = await OTPService.verifyOTPForRegister({
          phone: state.phone,
          sessionInfo: state.sessionInfo,
          otp: otp
        });

        if (verifyResponse.success && verifyResponse.isVerified) {
          showToast(verifyResponse.message, 'success');
          
          // Proceed with registration
          if (state.registrationData) {
            const registerResponse = await AuthService.register(state.registrationData);
            
            if (registerResponse.success) {
              showToast(registerResponse.message, 'success');
              
              // Save token and user info
              localStorage.setItem(AUTH_TOKEN_KEY, registerResponse.token);
              localStorage.setItem(USER_INFO_KEY, JSON.stringify(registerResponse.user));
              
              // Redirect to home
              setTimeout(() => {
                navigate('/');
              }, 1500);
            }
          }
        }
      } else if (state.type === 'forgot-password') {
        // Verify OTP for forgot password
        const verifyResponse = await OTPService.verifyOTPForForgotPassword({
          phone: state.phone,
          sessionInfo: state.sessionInfo,
          otp: otp
        });

        if (verifyResponse.success) {
          showToast(verifyResponse.message, 'success');
          
          // Navigate to reset password page with resetToken
          setTimeout(() => {
            navigate('/reset-password', {
              state: {
                resetToken: verifyResponse.resetToken,
                userId: verifyResponse.userId,
                phoneNumber: verifyResponse.phoneNumber
              }
            });
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error('OTP Verification error:', error);
      showToast(error.message || t('otp.verificationFailed'), 'error');
      // Clear OTP inputs on error
      setOtpCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    setCanResend(false);

    try {
      let response;
      if (state.type === 'register') {
        response = await OTPService.sendOTPForRegister({ phone: state.phone });
      } else {
        response = await OTPService.sendOTPForForgotPassword({ phone: state.phone });
      }

      if (response.success) {
        showToast(response.message, 'success');
        
        // Update state with new sessionInfo
        navigate(location.pathname, {
          state: {
            ...state,
            sessionInfo: response.sessionInfo,
            expiresIn: response.expiresIn
          },
          replace: true
        });
        
        // Reset timer
        setTimeLeft(response.expiresIn);
        setOtpCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      showToast(error.message || t('otp.resendFailed'), 'error');
      setCanResend(true);
    } finally {
      setIsResending(false);
    }
  };

  if (!state) {
    return null;
  }

  return (
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-header">
          <h1>{t('otp.title')}</h1>
          <p className="otp-subtitle">
            {t('otp.subtitle')} <strong>{state.phone}</strong>
          </p>
        </div>

        <div className="otp-form">
          <div className="otp-inputs">
            {otpCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                maxLength={1}
                disabled={isVerifying}
              />
            ))}
          </div>

          <div className="otp-timer">
            {timeLeft > 0 ? (
              <p>{t('otp.timeRemaining')}: <span className="timer">{formatTime(timeLeft)}</span></p>
            ) : (
              <p className="expired">{t('otp.expired')}</p>
            )}
          </div>

          <div className="otp-actions">
            <button
              onClick={handleVerifyOTP}
              disabled={isVerifying || otpCode.join('').length !== 6}
              className="verify-btn"
            >
              {isVerifying ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div className="spinner"></div>
                  {t('otp.verifying')}
                </span>
              ) : t('otp.verify')}
            </button>

            <button
              onClick={handleResendOTP}
              disabled={!canResend || isResending}
              className={`resend-btn ${canResend ? 'active' : ''}`}
            >
              {isResending ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div className="spinner"></div>
                  {t('otp.resending')}
                </span>
              ) : t('otp.resend')}
            </button>
          </div>

          <div className="otp-footer">
            <button onClick={() => navigate('/login')} className="back-btn">
              {t('otp.backToLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
