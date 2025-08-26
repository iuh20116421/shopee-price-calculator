import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Calculator, Home, ChevronDown, ShoppingBag, BookOpen, FileText, Users } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ConsultationPopup from './ConsultationPopup';
import logoImage from '../assets/images/logos.png';
// import { AUTH_TOKEN_KEY, USER_INFO_KEY } from '../constants/accounts';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // useEffect(() => {
  //   const token = localStorage.getItem(AUTH_TOKEN_KEY);
  //   const userInfo = localStorage.getItem(USER_INFO_KEY);
  //   if (token && userInfo) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // }, [location.pathname]); // Re-check when route changes

  // Get calculator URL based on current language
  const getCalculatorUrl = () => {
    return i18n.language === 'en' ? '/shopee-price-calculator' : '/tinh-gia-shopee';
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('.header-mobile-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // const handleLogout = () => {
  //   localStorage.removeItem(AUTH_TOKEN_KEY);
  //   localStorage.removeItem(USER_INFO_KEY);
  //   setIsAuthenticated(false);
  //   navigate(i18n.language === 'en' ? '/login' : '/dang-nhap');
  // };

  const navigation = [
    { 
      name: t('navigation.home'), 
      href: '/', 
      icon: Home 
    },
    { 
      name: t('navigation.calculator'), 
      href: getCalculatorUrl(), 
      icon: Calculator 
    },
  ];

  const serviceMenu = [
    { name: t('services.shopeeServices'), href: '#', icon: ShoppingBag },
    { name: t('services.lazadaServices'), href: '#', icon: ShoppingBag },
    { name: t('services.training'), href: '#', icon: BookOpen },
  ];

  const blogMenu = [
    { name: t('blog.news'), href: '#' },
    { name: t('blog.experience'), href: '#' },
    { name: t('blog.guide'), href: '#' },
    { name: t('blog.qa'), href: '#' },
  ];

  const handleDropdownToggle = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName);
  };

  return (
    <header className="header-main">
      {/* Main header */}
      <div className="header-main-content">
        <div className="container-custom">
          <div className="header-content">
            {/* Logo */}
            <div className="header-logo">
              <Link to="/" className="logo-link">
                <img src={logoImage} alt="TUKIGROUP Logo" className="logo-image" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="header-nav">
              <ul className="nav-menu">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name} className="nav-item">
                      <Link
                        to={item.href}
                        className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                      >
                        <Icon className="nav-icon" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
                
                {/* Services Dropdown */}
                <li className="nav-item nav-dropdown">
                  <button
                    className={`nav-link nav-dropdown-toggle ${activeDropdown === 'services' ? 'nav-dropdown-active' : ''}`}
                    onClick={() => handleDropdownToggle('services')}
                  >
                    {t('navigation.services')}
                    <ChevronDown className="dropdown-icon" />
                  </button>
                  {activeDropdown === 'services' && (
                    <ul className="nav-dropdown-menu">
                      {serviceMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.name} className="nav-dropdown-item">
                            <Link to={item.href} className="nav-dropdown-link">
                              <Icon className="nav-dropdown-icon" />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>

                {/* Blog Dropdown */}
                <li className="nav-item nav-dropdown">
                  <button
                    className={`nav-link nav-dropdown-toggle ${activeDropdown === 'blog' ? 'nav-dropdown-active' : ''}`}
                    onClick={() => handleDropdownToggle('blog')}
                  >
                    {t('navigation.blog')}
                    <ChevronDown className="dropdown-icon" />
                  </button>
                  {activeDropdown === 'blog' && (
                    <ul className="nav-dropdown-menu">
                      {blogMenu.map((item) => (
                        <li key={item.name} className="nav-dropdown-item">
                          <Link to={item.href} className="nav-dropdown-link">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li className="nav-item">
                  <Link to="/contact" className="nav-link">
                    {t('navigation.contact')}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Desktop CTA Button and Language Switcher */}
            <div className="header-cta">
              <LanguageSwitcher />
              <button 
                className="btn-primary"
                onClick={() => setIsPopupOpen(true)}
              >
                {t('navigation.consultation')}
              </button>
              {/* Tạm thời comment out phần đăng nhập/đăng xuất */}
              {/* {isAuthenticated ? (
                <>
                 
                  <button 
                    className="btn-primary"
                    onClick={handleLogout}
                  >
                    {t('login.signOut')}
                  </button>
                </>
              ) : (
                <Link 
                  to={i18n.language === 'en' ? '/login' : '/dang-nhap'} 
                  className="btn-primary"
                >
                  {t('login.signIn')}
                </Link>
              )} */}
            </div>

            {/* Mobile CTA and Menu */}
            <div className="header-mobile-actions">
              <div className="mobile-buttons">
                <button 
                  className="mobile-cta-button"
                  onClick={() => setIsPopupOpen(true)}
                >
                  {t('navigation.consultation')}
                </button>
                {/* Tạm thời comment out phần đăng nhập/đăng xuất mobile */}
                {/* {isAuthenticated ? (
                  <button 
                    className="mobile-cta-button"
                    onClick={handleLogout}
                  >
                    {t('login.signOut')}
                  </button>
                ) : (
                  <Link 
                    to={i18n.language === 'en' ? '/login' : '/dang-nhap'} 
                    className="mobile-cta-button"
                  >
                    {t('login.signIn')}
                  </Link>
                )} */}
              </div>
              <div className="header-mobile-toggle">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="mobile-menu-btn"
                >
                  <Menu className="mobile-menu-icon" />
                </button>
                {isMenuOpen && (
                  <div className="mobile-dropdown">

                    <Link to="/" className="mobile-dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Home className="mobile-dropdown-icon" />
                      {t('navigation.home')}
                    </Link>
                    <Link to={getCalculatorUrl()} className="mobile-dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Calculator className="mobile-dropdown-icon" />
                      {t('navigation.calculator')}
                    </Link>
                    {/* Services Section */}
                    <div className="mobile-dropdown-section">
                      <div className="mobile-dropdown-title">{t('navigation.services')}</div>
                      {serviceMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.name} to={item.href} className="mobile-dropdown-item mobile-dropdown-subitem" onClick={() => setIsMenuOpen(false)}>
                            <Icon className="mobile-dropdown-icon" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                    
                    {/* Blog Section */}
                    <div className="mobile-dropdown-section">
                      <div className="mobile-dropdown-title">{t('navigation.blog')}</div>
                      {blogMenu.map((item) => (
                        <Link key={item.name} to={item.href} className="mobile-dropdown-item mobile-dropdown-subitem" onClick={() => setIsMenuOpen(false)}>
                          <FileText className="mobile-dropdown-icon" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <Link to="/contact" className="mobile-dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Users className="mobile-dropdown-icon" />
                      {t('navigation.contact')}
                    </Link>

                    {/* Mobile Language Switcher */}
                    <div className="mobile-dropdown-cta">
                      <div className="mobile-language-switcher">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Popup */}
      <ConsultationPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </header>
  );
};

export default Header;