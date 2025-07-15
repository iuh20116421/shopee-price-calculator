import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calculator, Mail, Phone, MapPin, Facebook, Youtube, Instagram, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-main">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="footer-content">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-section footer-company">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <Calculator className="footer-logo-svg" />
                </div>
                <div className="footer-logo-text">
                  <h3 className="footer-logo-title">TUKIGROUP</h3>
                  <p className="footer-logo-subtitle">Shopee Calculator</p>
                </div>
              </div>
              <p className="footer-description">
                {t('footer.description')}
              </p>
              <div className="footer-social">
                <a href="#" className="footer-social-link">
                  <Facebook className="footer-social-icon" />
                </a>
                <a href="#" className="footer-social-link">
                  <Youtube className="footer-social-icon" />
                </a>
                <a href="#" className="footer-social-link">
                  <Instagram className="footer-social-icon" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-section-title">{t('footer.quickLinks')}</h4>
              <ul className="footer-links">
                <li className="footer-link-item">
                  <Link to="/" className="footer-link">
                    {t('navigation.home')}
                  </Link>
                </li>
                <li className="footer-link-item">
                  <Link to="/calculator" className="footer-link">
                    {t('navigation.calculator')}
                  </Link>
                </li>
                <li className="footer-link-item">
                  <a href="#" className="footer-link">
                    {t('navigation.guide')}
                  </a>
                </li>
                <li className="footer-link-item">
                  <a href="#" className="footer-link">
                    {t('navigation.contact')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="footer-section-title">{t('footer.services')}</h4>
              <ul className="footer-links">
                <li className="footer-link-item">
                  <a href="#" className="footer-link">
                    {t('services.shopeeServices')}
                  </a>
                </li>
                <li className="footer-link-item">
                  <a href="#" className="footer-link">
                    {t('services.lazadaServices')}
                  </a>
                </li>
                <li className="footer-link-item">
                  <a href="#" className="footer-link">
                    {t('services.training')}
                  </a>
                </li>
                <li className="footer-link-item">
                  <a href="#" className="footer-link">
                    {t('services.consulting')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="footer-section-title">{t('footer.contactInfo')}</h4>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <MapPin className="footer-contact-icon" />
                  <div className="footer-contact-text">
                    <p className="footer-contact-label">{t('footer.address')}</p>
                    <p className="footer-contact-value">Tòa nhà Big Win Tower, số 01, ngõ 23 Lê Văn Lương, Thanh Xuân, Hà Nội</p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <Phone className="footer-contact-icon" />
                  <div className="footer-contact-text">
                    <p className="footer-contact-label">{t('footer.phone')}</p>
                    <p className="footer-contact-value">(+84) 0345.811.456</p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <Mail className="footer-contact-icon" />
                  <div className="footer-contact-text">
                    <p className="footer-contact-label">{t('footer.email')}</p>
                    <p className="footer-contact-value">tukigroup123@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Bar */}
        <div className="footer-company-info">
          <div className="footer-company-details">
            <p className="footer-company-name">CÔNG TY CỔ PHẦN TẬP ĐOÀN TUKIGROUP</p>
            <p className="footer-company-tax">Mã số thuế: 0109789110</p>
            <p className="footer-company-date">Ngày cấp: 25/10/2021</p>
            <p className="footer-company-issuer">Nơi cấp: SỞ KẾ HOẠCH VÀ ĐẦU TƯ THÀNH PHỐ HÀ NỘI</p>
            <p className="footer-company-representative">Người đại diện: NGUYỄN TRUNG KIÊN</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © 2024 TUKIGROUP. {t('footer.copyright')}
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#" className="footer-bottom-link">
                {t('footer.termsOfService')}
              </a>
              <a href="#" className="footer-bottom-link">
                {t('footer.paymentPolicy')}
              </a>
              <a href="#" className="footer-bottom-link">
                {t('footer.returnPolicy')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button onClick={scrollToTop} className="back-to-top">
        <ArrowUp className="back-to-top-icon" />
      </button>
    </footer>
  );
};

export default Footer; 