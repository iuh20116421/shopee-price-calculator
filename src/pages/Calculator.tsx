import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator as CalculatorIcon, Box, Store, TrendingUp, Facebook, Phone } from 'lucide-react';
import shopeeMallData from '../constants/shopeeMallData.json';
import shopeeRegularData from '../constants/shopeeRegularData.json';
import { 
  calculateSellingPrice, 
  formatCurrency, 
  formatPercentage, 
  parseFeeString,
  CalculationInput,
  CalculationResult 
} from '../constants/calculationFormulas';

interface CategoryData {
  [key: string]: string | CategoryData;
}

const Calculator: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProductFee, setSelectedProductFee] = useState<string | null>(null);
  const [currentData, setCurrentData] = useState<CategoryData>({});
  const [formData, setFormData] = useState({
    cogs: '',
    shopeeType: 'mall' as 'mall' | 'regular',
    marketingCostPercent: '',
    desiredProfitPercent: '',
    piShip: 'no' as 'yes' | 'no',
    contentXtra: false,
    voucherXtra: false
  });
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Lấy dữ liệu sản phẩm theo loại Shopee
  const getProductData = (): CategoryData => {
    return formData.shopeeType === 'mall' ? shopeeMallData : shopeeRegularData;
  };

  // Xử lý thay đổi loại Shopee
  const handleShopeeTypeChange = (type: 'mall' | 'regular') => {
    setFormData(prev => ({ ...prev, shopeeType: type }));
    setSelectedCategories([]);
    setSelectedProductFee(null);
    setCurrentData({});
    setShowResult(false);
    setCalculationResult(null);
  };

  // Xử lý chọn danh mục
  const handleCategorySelect = (level: number, value: string) => {
    // Xóa lỗi category nếu có
    clearError('category');
    
    const newCategories = [...selectedCategories.slice(0, level - 1), value];
    setSelectedCategories(newCategories);

    const productData = getProductData();
    let currentLevelData = productData;
    
    // Điều hướng qua các cấp danh mục đã chọn
    for (let i = 0; i < newCategories.length; i++) {
      const categoryValue = currentLevelData[newCategories[i]];
      
      if (typeof categoryValue === 'string') {
        // Đây là cấp cuối cùng, hiển thị phí
        setSelectedProductFee(categoryValue);
        setShowResult(false);
        setCalculationResult(null);
        return;
      } else {
        currentLevelData = categoryValue as CategoryData;
      }
    }

    setCurrentData(currentLevelData);
    setSelectedProductFee(null);
    setShowResult(false);
    setCalculationResult(null);
  };

  // Lấy danh sách danh mục cho level
  const getCategoryOptions = (level: number): string[] => {
    if (level === 1) {
      return Object.keys(getProductData());
    }

    const productData = getProductData();
    let currentLevelData = productData;
    
    // Điều hướng đến cấp trước đó
    for (let i = 0; i < level - 1; i++) {
      if (selectedCategories[i]) {
        const categoryValue = currentLevelData[selectedCategories[i]];
        if (typeof categoryValue === 'string') {
          // Nếu đã đến cấp cuối, không có cấp con
          return [];
        }
        currentLevelData = categoryValue as CategoryData;
      } else {
        return [];
      }
    }

    return Object.keys(currentLevelData);
  };

  // Kiểm tra xem có cần hiển thị cấp danh mục tiếp theo không
  const shouldShowNextLevel = (level: number): boolean => {
    if (level === 1) {
      return Boolean(selectedCategories[0]) && getCategoryOptions(2).length > 0;
    }
    
    const productData = getProductData();
    let currentLevelData = productData;
    
    // Điều hướng đến cấp hiện tại
    for (let i = 0; i < level - 1; i++) {
      if (selectedCategories[i]) {
        const categoryValue = currentLevelData[selectedCategories[i]];
        if (typeof categoryValue === 'string') {
          return false; // Đã đến cấp cuối
        }
        currentLevelData = categoryValue as CategoryData;
      } else {
        return false;
      }
    }
    
    // Kiểm tra xem cấp hiện tại có cấp con không
    if (selectedCategories[level - 1]) {
      const categoryValue = currentLevelData[selectedCategories[level - 1]];
      return typeof categoryValue === 'object' && Object.keys(categoryValue).length > 0;
    }
    
    return false;
  };

  // Hiển thị toast thông báo
  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    // Tạo toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Thêm vào body
    document.body.appendChild(toast);
    
    // Hiển thị toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!selectedProductFee) {
      newErrors.category = 'Vui lòng chọn ngành hàng đầy đủ';
    }

    if (!formData.cogs || parseFloat(formData.cogs) <= 0) {
      newErrors.cogs = 'Vui lòng nhập giá vốn sản phẩm hợp lệ';
    }

    if (!formData.desiredProfitPercent || parseFloat(formData.desiredProfitPercent) < 0) {
      newErrors.desiredProfitPercent = 'Vui lòng nhập lợi nhuận mong muốn hợp lệ';
    }

    if (formData.marketingCostPercent && parseFloat(formData.marketingCostPercent) < 0) {
      newErrors.marketingCostPercent = 'Chi phí marketing không hợp lệ';
    }

    setErrors(newErrors);
    
    // Thêm class error cho các input có lỗi
    Object.keys(newErrors).forEach(fieldName => {
      const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
      if (inputElement) {
        inputElement.classList.add('error');
      }
    });
    
    // Xóa class error cho các input không có lỗi
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
      const inputName = (input as HTMLInputElement).name;
      if (inputName && !newErrors[inputName]) {
        input.classList.remove('error');
      }
    });
    
    return Object.keys(newErrors).length === 0;
  };

  // Tính toán
  const handleCalculate = () => {
    if (!validateForm()) {
      // Hiển thị toast với lỗi đầu tiên
      const firstError = Object.values(errors)[0];
      if (firstError) {
        showToast(firstError, 'error');
      }
      return;
    }

    const input: CalculationInput = {
      cogs: parseFloat(formData.cogs),
      productFeePercent: parseFeeString(selectedProductFee!),
      shopeeType: formData.shopeeType,
      marketingCostPercent: formData.marketingCostPercent ? parseFloat(formData.marketingCostPercent) : undefined,
      desiredProfitPercent: parseFloat(formData.desiredProfitPercent),
      piShip: formData.piShip,
      contentXtra: formData.contentXtra,
      voucherXtra: formData.voucherXtra
    };

    const result = calculateSellingPrice(input);
    setCalculationResult(result);
    setShowResult(true);

    if (result.isValid) {
      showToast('Tính toán thành công!', 'success');
      // Scroll to result
      setTimeout(() => {
        const resultSection = document.getElementById('resultSection');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      showToast(result.errorMessage || 'Có lỗi xảy ra khi tính toán', 'error');
    }
  };

  // Format input tiền
  const formatMoneyInput = (value: string): string => {
    return value.replace(/[^\d.]/g, '');
  };

  // Format input phần trăm
  const formatPercentageInput = (value: string): string => {
    return value.replace(/[^\d.]/g, '');
  };

  // Xóa lỗi khi user bắt đầu nhập
  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      // Xóa class error
      const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
      if (inputElement) {
        inputElement.classList.remove('error');
      }
    }
  };

  return (
    <div className="calculator-page">
      <div className="calculator-container">
        {/* Header */}
        <div className="calculator-header">
          <h1>
            <CalculatorIcon className="header-icon" />
            Công Cụ Tính Giá Bán Shopee
          </h1>
          <p>Tính toán chi phí và lợi nhuận bán hàng trên Shopee một cách chính xác</p>
        </div>

        <div className="calculator-content">
          <div className="form-grid">
            {/* Thông tin sản phẩm */}
            <div className="form-section">
              <div className="section-title">
                <Box className="section-icon" />
                Thông tin sản phẩm
              </div>

              {/* Loại Shopee */}
              <div className="form-group">
                <label>Loại Shopee:<span className="required">*</span></label>
                <div className="radio-group">
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="shopeeMall"
                      name="shopeeType"
                      value="mall"
                      checked={formData.shopeeType === 'mall'}
                      onChange={() => handleShopeeTypeChange('mall')}
                    />
                    <label htmlFor="shopeeMall">Shopee Mall</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="shopeeRegular"
                      name="shopeeType"
                      value="regular"
                      checked={formData.shopeeType === 'regular'}
                      onChange={() => handleShopeeTypeChange('regular')}
                    />
                    <label htmlFor="shopeeRegular">Shopee thường</label>
                  </div>
                </div>
              </div>

              {/* Danh mục cấp 1 */}
              <div className="form-group">
                <label>Ngành hàng cấp 1:<span className="required">*</span></label>
                <select 
                  name="category"
                  value={selectedCategories[0] || ''}
                  onChange={(e) => handleCategorySelect(1, e.target.value)}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Chọn ngành hàng cấp 1</option>
                  {getCategoryOptions(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
              </div>

              {/* Danh mục cấp 2 */}
              {shouldShowNextLevel(1) && (
                <div className="form-group">
                  <label>Ngành hàng cấp 2:<span className="required">*</span></label>
                  <select 
                    value={selectedCategories[1] || ''}
                    onChange={(e) => handleCategorySelect(2, e.target.value)}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Chọn ngành hàng cấp 2</option>
                    {getCategoryOptions(2).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <div className="error-message">{errors.category}</div>}
                </div>
              )}

              {/* Danh mục cấp 3 */}
              {shouldShowNextLevel(2) && (
                <div className="form-group">
                  <label>Ngành hàng cấp 3:<span className="required">*</span></label>
                  <select 
                    value={selectedCategories[2] || ''}
                    onChange={(e) => handleCategorySelect(3, e.target.value)}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Chọn ngành hàng cấp 3</option>
                    {getCategoryOptions(3).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <div className="error-message">{errors.category}</div>}
                </div>
              )}

              {/* Danh mục cấp 4 */}
              {shouldShowNextLevel(3) && (
                <div className="form-group">
                  <label>Ngành hàng cấp 4:</label>
                  <select 
                    value={selectedCategories[3] || ''}
                    onChange={(e) => handleCategorySelect(4, e.target.value)}
                  >
                    <option value="">Chọn ngành hàng cấp 4</option>
                    {getCategoryOptions(4).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Hiển thị phí cố định */}
              {selectedProductFee && (
                <div className="fee-display">
                  <strong>Phí cố định sản phẩm: {selectedProductFee}</strong>
                </div>
              )}

              {/* Giá vốn sản phẩm */}
              <div className="form-group">
                <label>Giá vốn sản phẩm (VND):<span className="required">*</span></label>
                <input
                  name="cogs"
                  type="text"
                  value={formData.cogs}
                  onChange={(e) => {
                    clearError('cogs');
                    setFormData(prev => ({ 
                      ...prev, 
                      cogs: formatMoneyInput(e.target.value) 
                    }));
                  }}
                  placeholder="Nhập giá vốn sản phẩm"
                  className={errors.cogs ? 'error' : ''}
                />
                {errors.cogs && <div className="error-message">{errors.cogs}</div>}
              </div>
            </div>

            {/* Cài đặt Shopee */}
            <div className="form-section">
              <div className="section-title">
                <Store className="section-icon" />
                Cài đặt Shopee
              </div>

              {/* Pi Ship */}
              <div className="form-group">
                <label>Sử dụng Pi Ship:</label>
                <div className="radio-group">
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="piShipYes"
                      name="piShip"
                      value="yes"
                      checked={formData.piShip === 'yes'}
                      onChange={(e) => setFormData(prev => ({ ...prev, piShip: e.target.value as 'yes' | 'no' }))}
                    />
                    <label htmlFor="piShipYes">Có (1,620 VND)</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="piShipNo"
                      name="piShip"
                      value="no"
                      checked={formData.piShip === 'no'}
                      onChange={(e) => setFormData(prev => ({ ...prev, piShip: e.target.value as 'yes' | 'no' }))}
                    />
                    <label htmlFor="piShipNo">Không</label>
                  </div>
                </div>
              </div>

              {/* Content Xtra */}
              <div className="form-group">
                <label>Dịch vụ Content Xtra:</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="contentXtra"
                      checked={formData.contentXtra}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentXtra: e.target.checked }))}
                    />
                    <label htmlFor="contentXtra">
                      Sử dụng Content Xtra (2.59%
                      {formData.shopeeType === 'mall' ? ', tối đa 50,000 VND' : ''})
                    </label>
                  </div>
                </div>
              </div>

              {/* Voucher Xtra */}
              <div className="form-group">
                <label>Dịch vụ Voucher Xtra:</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="voucherXtra"
                      checked={formData.voucherXtra}
                      onChange={(e) => setFormData(prev => ({ ...prev, voucherXtra: e.target.checked }))}
                    />
                    <label htmlFor="voucherXtra">Sử dụng Voucher Xtra (1.96%)</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chi phí dự tính */}
          <div className="form-section wide">
            <div className="section-title">
              <TrendingUp className="section-icon" />
              Chi phí dự tính
            </div>

            <div className="cost-grid">
              {/* Lợi nhuận mong muốn */}
              <div className="form-group">
                <label>Lợi nhuận mong muốn (%):<span className="required">*</span></label>
                <input
                  name="desiredProfitPercent"
                  type="text"
                  value={formData.desiredProfitPercent}
                  onChange={(e) => {
                    clearError('desiredProfitPercent');
                    setFormData(prev => ({ 
                      ...prev, 
                      desiredProfitPercent: formatPercentageInput(e.target.value) 
                    }));
                  }}
                  placeholder="20.00"
                  className={errors.desiredProfitPercent ? 'error' : ''}
                />
                {errors.desiredProfitPercent && <div className="error-message">{errors.desiredProfitPercent}</div>}
              </div>

              {/* Chi phí marketing */}
              <div className="form-group">
                <label>Chi phí marketing (%):</label>
                <input
                  name="marketingCostPercent"
                  type="text"
                  value={formData.marketingCostPercent}
                  onChange={(e) => {
                    clearError('marketingCostPercent');
                    setFormData(prev => ({ 
                      ...prev, 
                      marketingCostPercent: formatPercentageInput(e.target.value) 
                    }));
                  }}
                  placeholder="0.00"
                  className={errors.marketingCostPercent ? 'error' : ''}
                />
                {errors.marketingCostPercent && <div className="error-message">{errors.marketingCostPercent}</div>}
              </div>
            </div>

            {/* Nút tính toán */}
            <button 
              className="calculate-btn" 
              onClick={handleCalculate}
            >
              <TrendingUp className="btn-icon" />
              Tính Giá Bán
            </button>
          </div>

          {/* Kết quả tính toán */}
          {showResult && calculationResult && (
            <div id="resultSection" className="result-section">
              <div className="result-header">
                <h2>
                  <CalculatorIcon className="result-icon" />
                  Kết Quả Tính Toán
                </h2>
              </div>
              
              <div className="result-content">
                {!calculationResult.isValid ? (
                  <div className="error-message" style={{ textAlign: 'center', fontSize: '1.1rem', padding: '20px' }}>
                    {calculationResult.errorMessage}
                  </div>
                ) : (
                  <div className="result-grid">
                    {/* Chi phí Shopee */}
                    <div className="result-card">
                      <h3>
                        <Store className="card-icon" />
                        Chi phí Shopee
                      </h3>
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td>Phí cố định sản phẩm:</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.productFee)}</td>
                          </tr>
                          <tr>
                            <td>Phí thanh toán (4.91%):</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.paymentFee)}</td>
                          </tr>
                          <tr>
                            <td>Phí vận chuyển Pi Ship:</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.shippingCost)}</td>
                          </tr>
                          <tr>
                            <td>Phí Content Xtra:</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.contentXtraFee)}</td>
                          </tr>
                          <tr>
                            <td>Phí Voucher Xtra:</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.voucherXtraFee)}</td>
                          </tr>
                          <tr>
                            <td>Phí hạ tầng:</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.infrastructureFee)}</td>
                          </tr>
                          <tr>
                            <td>VAT (1.5%):</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.vatFee)}</td>
                          </tr>
                          {calculationResult.marketingCost > 0 && (
                            <tr>
                              <td>Chi phí marketing:</td>
                              <td className="highlight-value">{formatCurrency(calculationResult.marketingCost)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Tổng kết */}
                    <div className="result-card">
                      <h3>
                        <TrendingUp className="card-icon" />
                        Tổng Kết
                      </h3>
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td>Giá vốn sản phẩm:</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.cogs)}</td>
                          </tr>
                          <tr>
                            <td>Tổng chi phí:</td>
                            <td className="highlight-value">{formatCurrency(calculationResult.totalCost)}</td>
                          </tr>
                          <tr className="final-price-row">
                            <td><strong>Giá bán cuối cùng:</strong></td>
                            <td className="highlight-value" style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                              {formatCurrency(calculationResult.finalPrice)}
                            </td>
                          </tr>
                          <tr>
                            <td>Lợi nhuận:</td>
                            <td className={`highlight-value ${calculationResult.profit >= 0 ? 'profit-positive' : 'profit-negative'}`}>
                              {formatCurrency(calculationResult.profit)}
                            </td>
                          </tr>
                          <tr>
                            <td>Tỷ lệ lợi nhuận:</td>
                            <td className={`highlight-value ${calculationResult.profitMargin >= 0 ? 'profit-positive' : 'profit-negative'}`}>
                              {formatPercentage(calculationResult.profitMargin)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phần tư vấn */}
          <div className="consultation-section">
            <div className="consultation-title">
              <Phone className="consultation-icon" />
              Cần tư vấn thêm?
            </div>
            <div>
              <a href="https://www.facebook.com/tukigroup" target="_blank" rel="noopener noreferrer" className="consultation-btn facebook">
                <Facebook />
                Facebook TukiGroup
              </a>
              <a href="tel:+84345811456" className="consultation-btn zalo">
                <Phone />
                Hotline: 0345.811.456
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 