import React from 'react';
import './locales/i18n';
import AppRoutes from './routes/AppRoutes';
import { useDefaultLanguage } from './hooks/useDefaultLanguage';

function App() {
  useDefaultLanguage(); // Ensure Vietnamese is default language
  
  return <AppRoutes />;
}

export default App;
