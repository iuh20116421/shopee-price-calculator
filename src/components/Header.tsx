import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Calculator, Home, ChevronDown, ShoppingBag, BookOpen, FileText, Users } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

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
                <div className="logo-icon">
                  <Calculator className="logo-svg" />
                </div>
                <div className="logo-text">
                  <span className="logo-title">TUKIGROUP</span>
                  <span className="logo-subtitle">Shopee Calculator</span>
                </div>
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

            {/* CTA Button and Language Switcher */}
            <div className="header-cta">
              <LanguageSwitcher />
              <button className="btn-primary">
                {t('navigation.consultation')}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="header-mobile-toggle">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="mobile-menu-btn"
              >
                {isMenuOpen ? (
                  <X className="mobile-menu-icon" />
                ) : (
                  <Menu className="mobile-menu-icon" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <ul className="mobile-nav-menu">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name} className="mobile-nav-item">
                    <Link
                      to={item.href}
                      className={`mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="mobile-nav-icon" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <li className="mobile-nav-item">
                <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 