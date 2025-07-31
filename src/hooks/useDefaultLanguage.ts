import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useDefaultLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Force Vietnamese as default language if no language is set
    if (!i18n.language || i18n.language === 'en') {
      const savedLanguage = localStorage.getItem('i18nextLng');
      if (!savedLanguage || savedLanguage === 'en') {
        localStorage.setItem('i18nextLng', 'vi');
        i18n.changeLanguage('vi');
      }
    }
  }, [i18n]);

  return i18n.language;
}; 