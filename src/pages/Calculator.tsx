import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, DollarSign, Percent, Package, TrendingUp } from 'lucide-react';

interface CalculationResult {
  costPrice: number;
  shopeeFee: number;
  shippingFee: number;
  profit: number;
  sellingPrice: number;
  profitMargin: number;
}

const CalculatorPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    costPrice: '',
    desiredProfit: '',
    shippingFee: '',
    shopeeCommission: '5', // Default 5%
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePrice = () => {
    const costPrice = parseFloat(formData.costPrice) || 0;
    const desiredProfit = parseFloat(formData.desiredProfit) || 0;
    const shippingFee = parseFloat(formData.shippingFee) || 0;
    const shopeeCommission = parseFloat(formData.shopeeCommission) || 5;

    if (costPrice <= 0) {
      alert(t('calculator.validation.costPriceRequired'));
      return;
    }

    // Tính phí Shopee (commission)
    const shopeeFee = (costPrice + desiredProfit) * (shopeeCommission / 100);

    // Tính giá bán
    const sellingPrice = costPrice + desiredProfit + shippingFee + shopeeFee;

    // Tính lợi nhuận thực tế
    const actualProfit = sellingPrice - costPrice - shippingFee - shopeeFee;

    // Tính tỷ lệ lợi nhuận
    const profitMargin = (actualProfit / costPrice) * 100;

    setResult({
      costPrice,
      shopeeFee,
      shippingFee,
      profit: actualProfit,
      sellingPrice,
      profitMargin
    });
  };

  const resetForm = () => {
    setFormData({
      costPrice: '',
      desiredProfit: '',
      shippingFee: '',
      shopeeCommission: '5',
    });
    setResult(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('calculator.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('calculator.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('calculator.form.title')}
              </h2>

              <div className="space-y-6">
                {/* Giá vốn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline w-4 h-4 mr-2" />
                    {t('calculator.form.costPrice')}
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    placeholder={t('calculator.form.costPricePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Lợi nhuận mong muốn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline w-4 h-4 mr-2" />
                    {t('calculator.form.desiredProfit')}
                  </label>
                  <input
                    type="number"
                    name="desiredProfit"
                    value={formData.desiredProfit}
                    onChange={handleInputChange}
                    placeholder={t('calculator.form.desiredProfitPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Phí vận chuyển */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="inline w-4 h-4 mr-2" />
                    {t('calculator.form.shippingFee')}
                  </label>
                  <input
                    type="number"
                    name="shippingFee"
                    value={formData.shippingFee}
                    onChange={handleInputChange}
                    placeholder={t('calculator.form.shippingFeePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Phí hoa hồng Shopee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Percent className="inline w-4 h-4 mr-2" />
                    {t('calculator.form.shopeeCommission')}
                  </label>
                  <input
                    type="number"
                    name="shopeeCommission"
                    value={formData.shopeeCommission}
                    onChange={handleInputChange}
                    placeholder={t('calculator.form.shopeeCommissionPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={calculatePrice}
                    className="flex-1 btn-primary"
                  >
                    {t('calculator.form.calculate')}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 btn-secondary"
                  >
                    {t('calculator.form.reset')}
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('calculator.results.title')}
              </h2>

              {result ? (
                <div className="space-y-6">
                  {/* Giá bán đề xuất */}
                  <div className="bg-primary-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                                          <h3 className="text-lg font-semibold text-primary-900">
                      {t('calculator.results.suggestedPrice')}
                    </h3>
                      <DollarSign className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="text-3xl font-bold text-primary-600">
                      {result.sellingPrice.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>

                  {/* Chi tiết */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('calculator.results.costPrice')}</span>
                      <span className="font-medium">{result.costPrice.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('calculator.results.shopeeFee')}</span>
                      <span className="font-medium">{result.shopeeFee.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('calculator.results.shippingFee')}</span>
                      <span className="font-medium">{result.shippingFee.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('calculator.results.profit')}</span>
                      <span className="font-medium text-green-600">{result.profit.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">{t('calculator.results.profitMargin')}</span>
                      <span className="font-medium text-green-600">{result.profitMargin.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Khuyến nghị */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">{t('calculator.results.recommendation')}</h4>
                    <p className="text-green-700 text-sm">
                      {result.profitMargin > 20 
                        ? t('calculator.results.recommendations.high')
                        : result.profitMargin > 10
                        ? t('calculator.results.recommendations.medium')
                        : t('calculator.results.recommendations.low')
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {t('calculator.results.placeholder')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage; 