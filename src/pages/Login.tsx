import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { accounts, AUTH_TOKEN_KEY, USER_INFO_KEY } from '../constants/accounts';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(t('login.signUpDisabled'));
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(acc => acc.username === username && acc.password === password);
    
    if (account) {
      // Tạo token đơn giản (trong thực tế nên dùng JWT)
      const token = btoa(JSON.stringify({ username: account.username, role: account.role }));
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(account));
      
      // Redirect về trang chủ
      navigate('/');
    } else {
      setError(t('login.invalidCredentials'));
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
              <a href="https://www.facebook.com" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.google.com" className="social">
                <i className="fab fa-google"></i>
              </a>
              <a href="https://www.instagram.com" className="social">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <span>{t('login.orUseEmail')}</span>
            <input 
              type="text" 
              placeholder={t('login.username')} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder={t('login.password')} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit">{t('login.signUp')}</button>
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
              <a href="https://www.facebook.com" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.google.com" className="social">
                <i className="fab fa-google"></i>
              </a>
              <a href="https://www.instagram.com" className="social">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <span>{t('login.orUseAccount')}</span>
            <input 
              type="text" 
              placeholder={t('login.username')} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder={t('login.password')} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="error-message">{error}</div>}
            <a href="/">{t('login.forgotPassword')}</a>
            <button type="submit">{t('login.signInButton')}</button>
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