import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calculator, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Calculator,
      title: t('home.features.accuracy.title'),
      description: t('home.features.accuracy.description')
    },
    {
      icon: TrendingUp,
      title: t('home.features.analysis.title'),
      description: t('home.features.analysis.description')
    },
    {
      icon: Shield,
      title: t('home.features.security.title'),
      description: t('home.features.security.description')
    },
    {
      icon: Zap,
      title: t('home.features.performance.title'),
      description: t('home.features.performance.description')
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                {t('home.hero.title')}
                <span className="text-primary-600"> {t('home.hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/calculator"
                  className="btn-primary inline-flex items-center justify-center"
                >
                  {t('home.hero.ctaPrimary')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <button className="btn-secondary">
                  {t('home.hero.ctaSecondary')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="container-custom">
                  <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t('home.cta.button')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 