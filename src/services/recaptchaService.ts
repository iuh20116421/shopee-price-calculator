// reCAPTCHA v3 Service for Firebase SMS
export class RecaptchaService {
  private static siteKey =process.env.REACT_APP_RECAPTCHA_SITE_KEY  ;
  // Execute reCAPTCHA v3 for SMS action
  static async executeRecaptcha(action: string = 'sms'): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log("siteKey", this.siteKey);
      if (!this.siteKey) {
        reject(new Error('reCAPTCHA site key not configured'));
        return;
      }

      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA script not loaded'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(this.siteKey || '', { action })
          .then((token: string) => {
            console.log('reCAPTCHA token generated successfully');
            resolve(token);
          })
          .catch((error: any) => {
            console.error('reCAPTCHA error:', error);
            reject(new Error('Failed to generate reCAPTCHA token'));
          });
      });
    });
  }

  // Get reCAPTCHA token for OTP sending
  static async getOTPToken(): Promise<string> {
    try {
      const token = await this.executeRecaptcha('send_otp');
      return token;
    } catch (error) {
      console.error('Failed to get reCAPTCHA token for OTP:', error);
      // Fallback to test token for development
      if (process.env.REACT_APP_ENVIRONMENT === 'development') {
        console.warn('Using test reCAPTCHA token for development');
        return 'test';
      }
      throw error;
    }
  }

  // Verify if reCAPTCHA is available
  static isAvailable(): boolean {
    return !!window.grecaptcha && !!this.siteKey;
  }
}

// Global type declarations for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export default RecaptchaService;
