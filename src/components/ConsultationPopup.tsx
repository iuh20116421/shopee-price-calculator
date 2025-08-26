import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import popupImage from '../assets/images/popupTuVan.jpg';
import { googleSheetsService } from '../services/googleSheetsService';
import { showToast } from '../utils/toast';

interface ConsultationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationPopup: React.FC<ConsultationPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    shopIssue: '',
    shopLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    shopLink: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[-().]/g, '');
    const phoneRegex = /^(0[3-9]\d{8}|02\d{8,9})$/;
    return phoneRegex.test(cleanPhone);
  };

  const validateShopeeUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    
    try {
      const urlObj = new URL(url);
      // Kiểm tra domain có phải là Shopee không
      const shopeeRegex = /^(www\.)?shopee\.(vn|com|sg|my|th|ph|tw|co\.id|com\.br|cl|co\.th|com\.mx|com\.co|pl)$/i;
      
      if (!shopeeRegex.test(urlObj.hostname)) {
        return false;
      }
      
      // Kiểm tra path có chứa shop hoặc store không
      const pathRegex = /(shop|store)\/|\/[^/\s]+$/i;
      return pathRegex.test(urlObj.pathname);
      
    } catch (error) {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      fullName: '',
      phoneNumber: '',
      shopLink: ''
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('popup.validation.nameRequired');
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('popup.validation.phoneRequired');
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = t('popup.validation.phoneInvalid');
    }

    if (!formData.shopLink.trim()) {
      newErrors.shopLink = t('popup.validation.shopLinkRequired');
    } else if (!validateShopeeUrl(formData.shopLink)) {
      newErrors.shopLink = t('popup.validation.shopLinkInvalid');
    }

    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.phoneNumber && !newErrors.shopLink;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await googleSheetsService.submitConsultation({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        shopIssue: formData.shopIssue,
        shopLink: formData.shopLink
      });

      if (result.success) {
        showToast('Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');

        // Reset form
        setFormData({
          fullName: '',
          phoneNumber: '',
          shopIssue: '',
          shopLink: ''
        });

        onClose();
      } else {
        showToast(result.message || 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('Không thể gửi thông tin. Vui lòng kiểm tra kết nối mạng và thử lại.', 'error');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-left">
          <div className="popup-image-container">
            <img src={popupImage} alt="Tư vấn kinh doanh" className="popup-main-image" />
          </div>
        </div>
        <div className="popup-right">
          <button className="popup-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="popup-form-container">
            <h3 className="popup-form-title">{t('popup.popupTitle')}</h3>

            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={`${t('popup.namePlaceholder')} *`}
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                />
                {errors.fullName && (
                  <div className="form-error">
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder={`${t('popup.phonePlaceholder')} *`}
                  className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                />
                {errors.phoneNumber && (
                  <div className="form-error">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="shopIssue"
                  value={formData.shopIssue}
                  onChange={handleInputChange}
                  placeholder={t('popup.shopIssuePlaceholder')}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="url"
                  name="shopLink"
                  value={formData.shopLink}
                  onChange={handleInputChange}
                  placeholder={`${t('popup.shopLinkPlaceholder')} *`}
                  className={`form-input ${errors.shopLink ? 'error' : ''}`}
                />
                {errors.shopLink && (
                  <div className="form-error">
                    {errors.shopLink}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`popup-submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    {t('popup.processingText')}
                  </>
                ) : (
                  t('popup.submitButton')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPopup; 