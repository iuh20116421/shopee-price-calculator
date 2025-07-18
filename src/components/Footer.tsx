import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calculator, Mail, Phone, MapPin, Facebook, Youtube, Globe, ArrowUp, Home } from 'lucide-react';
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
                  <h3 className="footer-company-name-new">CÔNG TY CỔ PHẦN TẬP ĐOÀN TUKIGROUP</h3>
                  <div className="footer-company-details-new">
                    <p className="footer-company-tax">Mã số thuế: 0109789110</p>
                    <p className="footer-company-date">Ngày cấp: 25/10/2021</p>
                    <p className="footer-company-issuer">Nơi cấp: SỞ KẾ HOẠCH VÀ ĐẦU TƯ THÀNH PHỐ HÀ NỘI</p>
                    <p className="footer-company-representative">Người đại diện: NGUYỄN TRUNG KIÊN</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Info */}
            <div className="footer-section-right">
              <div className="footer-contact-new">
                <div className="footer-contact-item-new">
                  <Home className="footer-contact-icon-new" />
                  <p className="footer-contact-value-new">65 Đ. Nguyễn Minh Hoàng, Phường 12, Tân Bình, Hồ Chí Minh 70000, Việt Nam</p>
                </div>
                <div className="footer-contact-item-new">
                  <Phone className="footer-contact-icon-new" />
                  <p className="footer-contact-value-new">(+84) 0789.282.979</p>
                </div>
                <div className="footer-contact-item-new">
                  <Mail className="footer-contact-icon-new" />
                  <p className="footer-contact-value-new">hadmkt@gmail.com</p>
                </div>
                <div className="footer-contact-item-new">
                  <Globe className="footer-contact-icon-new" />
                  <a href="https://tukigroup.vn/" target="_blank" rel="noopener noreferrer" className="footer-contact-value-new footer-link">
                    https://tukigroup.vn/
                  </a>
                </div>
              </div>
              <div className="footer-social-new">
                <a href="https://www.facebook.com/TukiGroupHCM?locale=vi_VN" target="_blank" rel="noopener noreferrer" className="footer-social-link-new">
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
              ©2025 Tuki Group. Tất cả quyền được bảo lưu. | Chuyên về các giải pháp kinh doanh trên sàn thương mại điện tử Shopee
            </p>
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