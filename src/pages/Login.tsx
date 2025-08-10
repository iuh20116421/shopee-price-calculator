import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '../constants/accounts';
import { AuthService } from '../services';
import type { LoginRequest, CreateUserRequest } from '../services';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loginPhone, setLoginPhone] = useState(''); // Riêng cho form đăng nhập
  const [shopLink, setShopLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = t('login.title');
  }, [t]);

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!username.trim()) {
      setError(t('login.validation.usernameRequired'));
      return;
    }
    if (!phone.trim()) {
      setError(t('login.validation.phoneRequired'));
      return;
    }
    if (!password.trim()) {
      setError(t('login.validation.passwordRequired'));
      return;
    }
    if (!confirmPassword.trim()) {
      setError(t('login.validation.confirmPasswordRequired'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('login.validation.passwordMismatch'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const registerData: CreateUserRequest = {
        name: username.trim(),
        phone: phone.trim(),
        password: password.trim(),
        shopLink: shopLink.trim() || undefined,
      };

      const response = await AuthService.register(registerData);
      
      if (response.success) {
        // Save token and user info
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(response.user));
        
        // Redirect to home
        navigate('/');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || t('login.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // Validate required fields
    if (!loginPhone.trim()) {
      setError(t('login.validation.phoneRequired'));
      return;
    }
    if (!password.trim()) {
      setError(t('login.validation.passwordRequired'));
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const loginData: LoginRequest = {
        phone: loginPhone.trim(),
        password: password.trim(),
      };

      const response = await AuthService.login(loginData);
      
      if (response.success) {
        // Save token and user info
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(response.user));
        
        // Redirect to home
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || t('login.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className={`login-container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>{t('login.createAccount')}</h1>
            <div className="social-container">
              <a href="https://www.facebook.com" className="social facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.google.com" className="social google">
                <i className="fab fa-google"></i>
              </a>
              <a href="https://www.instagram.com" className="social instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <span>{t('login.orUseEmail')}</span>
            <input 
              type="text" 
              placeholder={`${t('login.username')} *`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input 
              type="tel" 
              placeholder={`${t('login.phone')} *`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder={t('login.shopLink')}
              value={shopLink}
              onChange={(e) => setShopLink(e.target.value)}
            />
            <div className="password-input-container">
              <input 
                type={showSignUpPassword ? "text" : "password"}
                placeholder={`${t('login.password')} *`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i 
                className={`fas ${showSignUpPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
              />
            </div>
            <div className="password-input-container">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder={`${t('login.confirmPassword')} *`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i 
                className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? t('login.loading') || 'Loading...' : t('login.signUp')}
            </button>
            <button type="button" className="mobile-switch-btn" onClick={handleSignInClick}>
              {t('login.signInButton')}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>{t('login.signIn')}</h1>
            <div className="social-container">
              <a href="https://www.facebook.com" className="social facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.google.com" className="social google">
                <i className="fab fa-google"></i>
              </a>
              <a href="https://www.instagram.com" className="social instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <span>{t('login.orUseAccount')}</span>
            <input 
              type="tel" 
              placeholder={t('login.phone')} 
              value={loginPhone}
              onChange={(e) => setLoginPhone(e.target.value)}
            />
            <div className="password-input-container">
              <input 
                type={showSignInPassword ? "text" : "password"}
                placeholder={t('login.password')} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i 
                className={`fas ${showSignInPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                onClick={() => setShowSignInPassword(!showSignInPassword)}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <a href="/">{t('login.forgotPassword')}</a>
            <button type="submit" disabled={loading}>
              {loading ? t('login.loading') || 'Loading...' : t('login.signInButton')}
            </button>
            <button type="button" className="mobile-switch-btn" onClick={handleSignUpClick}>
              {t('login.signUp')}
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>{t('login.welcomeBack')}</h1>
              <p>{t('login.welcomeMessage')}</p>
              <button className="ghost" onClick={handleSignInClick}>
                {t('login.signInButton')}
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>{t('login.helloFriend')}</h1>
              <p>{t('login.startJourney')}</p>
              <button className="ghost" onClick={handleSignUpClick}>
                {t('login.signUpButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;