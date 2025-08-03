import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import popupImage from '../assets/images/popupTuVan.jpg';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Section - Promotional Image */}
        <div className="popup-left">
          <div className="popup-image-container">
            <img src={popupImage} alt="Tư vấn kinh doanh" className="popup-main-image" />
          </div>
        </div>
                 {/* Right Section - Contact Form */}
         <div className="popup-right">
           <div className="popup-form-container">
             <button className="popup-close-btn" onClick={onClose}>
               <X size={20} />
             </button>
            <h3 className="popup-form-title">{t('popup.popupTitle')}</h3>
            
            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('popup.namePlaceholder')}
                  className="form-input"
                />
              </div>
              
                             <div className="form-group">
                 <input
                   type="tel"
                   name="phoneNumber"
                   value={formData.phoneNumber}
                   onChange={handleInputChange}
                   placeholder={t('popup.phonePlaceholder')}
                   className="form-input"
                   required
                 />
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
                   placeholder={t('popup.shopLinkPlaceholder')}
                   className="form-input"
                 />
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