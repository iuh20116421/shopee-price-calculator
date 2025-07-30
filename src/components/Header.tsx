import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Calculator, Home, ChevronDown, ShoppingBag, BookOpen, FileText, Users } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import logoImage from '../assets/images/logos.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

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

  const navigation = [
    { 
      name: t('navigation.home'), 
      href: '/', 
      icon: Home 
    },
    { 
      name: t('navigation.calculator'), 
      href: '/calculator', 
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
              <button className="btn-primary">
                {t('navigation.consultation')}
              </button>
            </div>

            {/* Mobile CTA and Menu */}
            <div className="header-mobile-actions">
              <button className="mobile-cta-button">
                {t('navigation.consultation')}
              </button>
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
                    <Link to="/calculator" className="mobile-dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Calculator className="mobile-dropdown-icon" />
                      {t('navigation.calculator')}
                    </Link>
                    <Link to="/services" className="mobile-dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingBag className="mobile-dropdown-icon" />
                      {t('navigation.services')}
                    </Link>
                    <Link to="/blog" className="mobile-dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <FileText className="mobile-dropdown-icon" />
                      {t('navigation.blog')}
                    </Link>
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


    </header>
  );
};

export default Header; 