import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);

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
    // Xử lý đăng ký
    console.log('Sign up form submitted');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập
    console.log('Sign in form submitted');
  };

  return (
    <div className="login-page">
      <div className={`login-container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>{t('login.createAccount')}</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <span>{t('login.orUseEmail')}</span>
            <input type="text" placeholder={t('login.name')} />
            <input type="email" placeholder={t('login.email')} />
            <input type="password" placeholder={t('login.password')} />
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
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <span>{t('login.orUseAccount')}</span>
            <input type="email" placeholder={t('login.email')} />
            <input type="password" placeholder={t('login.password')} />
            <a href="#">{t('login.forgotPassword')}</a>
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