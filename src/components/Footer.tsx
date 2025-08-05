import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Facebook, Youtube, Globe, ArrowUp, Home } from 'lucide-react';
import logoIcon from '../assets/images/logo_icon_trắng.png';

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
          <div className="footer-grid-new">
            {/* Left Column - Company Info */}
            <div className="footer-section-left">
              <div className="footer-company-content">
                <div className="footer-logo-new">
                  <div className="footer-logo-icon-new">
                    <img src={logoIcon} alt="Tuki Group Logo" className="footer-logo-image" />
                  </div>
                </div>
                <div className="footer-company-info">
                  <h3 className="footer-company-name-new">{t('footer.company.name')}</h3>
                  <div className="footer-company-details-new">
                    <p className="footer-company-tax">{t('footer.company.taxNumber')}: 0109789110</p>
                    <p className="footer-company-date">{t('footer.company.issueDate')}: 25/10/2021</p>
                    <p className="footer-company-issuer">{t('footer.company.issuer')}: {t('footer.company.issuerName')}</p>
                    <p className="footer-company-representative">{t('footer.company.representative')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="footer-section-right">
              <div className="footer-contact-new">
                <div className="footer-contact-item-new">
                  <Home className="footer-contact-icon-new" />
                  <p className="footer-contact-value-new">{t('footer.contact.address')}</p>
                </div>
                <div className="footer-contact-item-new">
                  <Phone className="footer-contact-icon-new" />
                  <p className="footer-contact-value-new">{t('footer.contact.phone')}</p>
                </div>
                <div className="footer-contact-item-new">
                  <Mail className="footer-contact-icon-new" />
                  <p className="footer-contact-value-new">hadmkt@gmail.com</p>
                </div>
                <div className="footer-contact-item-new">
                  <Globe className="footer-contact-icon-new" />
                  <a href="https://www.facebook.com/TukiGroupHCM" target="_blank" rel="noopener noreferrer" className="footer-contact-value-new footer-link">
                  https://www.facebook.com/TukiGroupHCM
                  </a>
                </div>
              </div>
              <div className="footer-social-new">
                <a href="https://www.facebook.com/TukiGroupHCM" target="_blank" rel="noopener noreferrer" className="footer-social-link-new">
                  <Facebook className="footer-social-icon-new" />
                </a>
                <a href="https://zalo.me/0789282979" target="_blank" rel="noopener noreferrer" className="footer-social-link-new">
                  <span className="zalo-icon">Zalo</span>
                </a>
                <a href="https://www.youtube.com/@nguyentrungkien3469" target="_blank" rel="noopener noreferrer" className="footer-social-link-new">
                  <Youtube className="footer-social-icon-new" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="footer-bottom-new">
          <div className="footer-bottom-content-new">
            <p className="footer-copyright-new">
              {t('footer.copyright')} | {t('footer.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Call button */}
      <a href="tel:0789282979" className="back-to-top">
        <Phone className="back-to-top-icon" />
      </a>
    </footer>
  );
};

export default Footer; 