import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator as CalculatorIcon, Box, Store, TrendingUp, Facebook, Phone, Search, Info } from 'lucide-react';
import shopeeMallData from '../constants/shopeeMallData.json';
import shopeeRegularData from '../constants/shopeeRegularData.json';
import CategorySelector from '../components/CategorySelector';
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

interface ProductSuggestion {
  name: string;
  fee: string;
  path: string[];
}

const Calculator: React.FC = () => {
  const { t } = useTranslation();
  const [productName, setProductName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{path: string[], fee: string} | null>(null);
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
  const [showMarketingTooltip, setShowMarketingTooltip] = useState(false);
  const [showProfitTooltip, setShowProfitTooltip] = useState(false);
  const [showCostPriceTooltip, setShowCostPriceTooltip] = useState(false);

  // Function to adjust tooltip position if it goes off screen
  const adjustTooltipPosition = (tooltipElement: HTMLElement) => {
    const rect = tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Check if tooltip goes off the right edge
    if (rect.right > viewportWidth - 10) {
      tooltipElement.style.left = 'auto';
      tooltipElement.style.right = '0';
      tooltipElement.style.transform = 'none';
    }
    
    // Check if tooltip goes off the left edge
    if (rect.left < 10) {
      tooltipElement.style.left = '0';
      tooltipElement.style.transform = 'none';
    }
    
    // Check if tooltip goes off the top edge
    if (rect.top < 10) {
      tooltipElement.style.top = 'auto';
      tooltipElement.style.bottom = '-45px';
    }
  };

  // Lấy dữ liệu sản phẩm theo loại Shopee
  const getProductData = (): CategoryData => {
    return formData.shopeeType === 'mall' ? shopeeMallData : shopeeRegularData;
  };

  // Tìm kiếm sản phẩm trong data
  const searchProducts = useCallback((searchTerm: string): ProductSuggestion[] => {
    if (!searchTerm.trim()) return [];
    
    const productData = getProductData();
    const results: ProductSuggestion[] = [];
    
    // Tách từ khóa thành các từ riêng biệt và chuẩn hóa (chỉ chuyển về chữ thường, giữ nguyên dấu)
    const searchWords = searchTerm
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    
    if (searchWords.length === 0) return [];
    
    const searchInCategory = (data: CategoryData, path: string[] = []) => {
      for (const [key, value] of Object.entries(data)) {
        const currentPath = [...path, key];
        
        if (typeof value === 'string') {
          // Đây là sản phẩm (có giá trị %)
          const productNameLower = key.toLowerCase();
          
          // Kiểm tra xem tên sản phẩm có chứa ít nhất 1 từ khóa không
          const hasMatch = searchWords.some(word => productNameLower.includes(word));
          
          if (hasMatch) {
            results.push({
              name: key,
              fee: value,
              path: currentPath
            });
          }
        } else {
          // Đây là danh mục con, tiếp tục tìm kiếm
          searchInCategory(value, currentPath);
        }
      }
    };
    
    searchInCategory(productData);
    
    // Sắp xếp theo độ tương đồng
    return results.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();
      
      // Đếm số từ khóa khớp
      const aMatchCount = searchWords.filter(word => aNameLower.includes(word)).length;
      const bMatchCount = searchWords.filter(word => bNameLower.includes(word)).length;
      
      // Sắp xếp theo số từ khóa khớp (nhiều hơn trước)
      if (aMatchCount !== bMatchCount) {
        return bMatchCount - aMatchCount;
      }
      
      // Nếu số từ khóa khớp bằng nhau, ưu tiên sản phẩm có tên bắt đầu bằng từ khóa
      const aStartsWith = searchWords.some(word => aNameLower.startsWith(word));
      const bStartsWith = searchWords.some(word => bNameLower.startsWith(word));
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Cuối cùng sắp xếp theo tên
      return a.name.localeCompare(b.name);
    }).slice(0, 10); // Giới hạn 10 kết quả
  }, [formData.shopeeType]);

  // Debounced search
  useEffect(() => {
    if (!productName.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const results = searchProducts(productName);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setIsSearching(false);
    }, 500); // Debounce 500ms

    return () => {
      clearTimeout(timeoutId);
      setIsSearching(false);
    };
  }, [productName, searchProducts]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.product-search-container')) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  // Xử lý thay đổi loại Shopee
  const handleShopeeTypeChange = (type: 'mall' | 'regular') => {
    setFormData(prev => ({ ...prev, shopeeType: type }));
    setProductName('');
    setSelectedProduct(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setShowResult(false);
    setCalculationResult(null);
    setSelectedCategory(null);
    clearError('product');
  };

  // Xử lý chọn category
  const handleCategorySelect = (categoryPath: string[], fee: string) => {
    setSelectedCategory({ path: categoryPath, fee });
    setProductName(categoryPath[categoryPath.length - 1]);
    setSelectedProduct({
      name: categoryPath[categoryPath.length - 1],
      fee: fee,
      path: categoryPath
    });
    setShowResult(false);
    setCalculationResult(null);
    clearError('product');
  };

  // Xử lý chọn sản phẩm từ gợi ý
  const handleProductSelect = (product: ProductSuggestion) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setShowResult(false);
    setCalculationResult(null);
    clearError('product');
    
    // Tự động chọn category theo đường dẫn của sản phẩm
    setSelectedCategory({
      path: product.path,
      fee: product.fee
    });
  };
    
  // Xử lý thay đổi tên sản phẩm
  const handleProductNameChange = (value: string) => {
    setProductName(value);
    if (!value.trim()) {
      setSelectedProduct(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
    clearError('product');
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

    if (!selectedCategory) {
      newErrors.product = t('calculator.validation.categoryRequired');
    }

    if (!formData.cogs || parseFloat(formData.cogs) <= 0) {
      newErrors.cogs = t('calculator.validation.costPriceRequired');
    }

    if (!formData.desiredProfitPercent || parseFloat(formData.desiredProfitPercent) < 0) {
      newErrors.desiredProfitPercent = t('calculator.validation.profitRequired');
    }

    if (formData.marketingCostPercent && parseFloat(formData.marketingCostPercent) < 0) {
      newErrors.marketingCostPercent = t('calculator.validation.marketingCostInvalid');
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
      productFeePercent: parseFeeString(selectedCategory!.fee),
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
      showToast(t('common.success'), 'success');
      // Scroll to result
      setTimeout(() => {
        const resultSection = document.getElementById('resultSection');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      showToast(result.errorMessage || t('common.error'), 'error');
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
            {t('calculator.title')}
          </h1>
          <p>{t('calculator.subtitle')}</p>
        </div>

        <div className="calculator-content">
          {/* Thông tin sản phẩm - Full width */}
          <div className="form-section wide">
              <div className="section-title">
                <Box className="section-icon" />
                {t('calculator.form.productInfo')}
              </div>

            <div className="settings-cost-layout">
              {/* Loại Shopee và Tên sản phẩm */}
              {/* Loại Shopee */}
                <div className="form-group inline">
                <label>{t('calculator.form.shopeeType')}<span className="required">*</span></label>
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
                    <label htmlFor="shopeeMall">{t('calculator.form.shopeeMall')}</label>
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
                    <label htmlFor="shopeeRegular">{t('calculator.form.shopeeRegular')}</label>
                  </div>
                </div>
              </div>

                {/* Tên sản phẩm */}
                <div className="form-group">
                  <label>{t('calculator.form.productName')}<span className="required">*</span></label>
                  <div className="product-search-container">
                    <div className="search-input-wrapper" style={{ position: 'relative' }}>
                      <input
                        name="product"
                        type="text"
                        value={productName}
                        onChange={(e) => handleProductNameChange(e.target.value)}
                        placeholder={t('calculator.form.productNamePlaceholder')}
                        className={`search-input ${errors.product ? 'error' : ''}`}
                        style={{ paddingRight: 40 }}
                      />
                      <Search
                        className="search-icon"
                        style={{
                          position: 'absolute',
                          right: 4,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#6b7280',
                          width: 18,
                          height: 18,
                          pointerEvents: 'none',
                          zIndex: 2
                        }}
                      />
                      {isSearching && <div className="searching-indicator">{t('calculator.form.searching')}</div>}
                    </div>
                    
                    {/* Dropdown gợi ý */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="suggestions-dropdown">
                        {suggestions.map((product, index) => (
                          <div
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleProductSelect(product)}
                          >
                            <div className="suggestion-name">{product.name}</div>
                            <div className="suggestion-path">{product.path.join(' > ')}</div>
                            <div className="suggestion-fee">{product.fee}</div>
                          </div>
                        ))}
                </div>
              )}
                  </div>
                  {errors.product && <div className="error-message">{errors.product}</div>}
                </div>

              {/* Chọn ngành hàng */}
                <div className="form-group">
                <label>{t('calculator.form.selectCategory')}<span className="required">*</span></label>
                <CategorySelector
                  data={getProductData()}
                  onCategorySelect={handleCategorySelect}
                  selectedPath={selectedCategory?.path || []}
                  maxLevels={formData.shopeeType === 'mall' ? 4 : 2}
                />
                </div>

              {/* Hiển thị sản phẩm đã chọn */}
              {selectedProduct && (
                <div className="selected-product">
                  <div className="selected-product-info">
                    <strong>{t('calculator.form.selectedProduct')}</strong> {selectedProduct.name}
                  </div>
                  <div className="selected-product-path">
                    <strong>{t('calculator.form.category')}</strong> {selectedProduct.path.join(' > ')}
                  </div>
                  <div className="selected-product-fee">
                    <strong>{t('calculator.form.fixedFee')}</strong> {selectedProduct.fee}
                  </div>
                </div>
              )}

              {/* Giá vốn sản phẩm */}
              <div className="form-group">
                <label>
                  {t('calculator.form.costPrice')}
                  <Info 
                    className="info-icon" 
                    onMouseEnter={() => setShowCostPriceTooltip(true)}
                    onMouseLeave={() => setShowCostPriceTooltip(false)}
                  />
                  {showCostPriceTooltip && (
                    <div className="tooltip">
                      Tổng chi phí để có sản phẩm sẵn sàng bán: giá nhập, vận chuyển, thuế, đóng gói, lưu kho.
                      <div className="tooltip-arrow"></div>
                    </div>
                  )}
                  <span className="required">*</span>
                </label>
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
                  placeholder={t('calculator.form.costPricePlaceholder')}
                  className={errors.cogs ? 'error' : ''}
                />
                {errors.cogs && <div className="error-message">{errors.cogs}</div>}
              </div>
              </div>
            </div>

          {/* Cài đặt Shopee và Chi phí dự tính - Combined */}
          <div className="form-section wide">
            <div className="settings-cost-layout">
            {/* Cài đặt Shopee */}
              <div className="settings-section">
              <div className="section-title">
                <Store className="section-icon" />
                {t('calculator.settings.title')}
              </div>

              {/* Pi Ship */}
                <div className="form-group inline">
                <label>{t('calculator.settings.usePiShip')}</label>
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
                      <label htmlFor="piShipYes">{t('calculator.settings.yes')}</label>
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
                    <label htmlFor="piShipNo">{t('calculator.settings.no')}</label>
                  </div>
                </div>
              </div>

                {/* Content Xtra và Voucher Xtra */}
                <div className="form-group inline">
                  <label>{t('calculator.settings.extraServices')}</label>
                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="contentXtra"
                      checked={formData.contentXtra}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentXtra: e.target.checked }))}
                    />
                                          <label htmlFor="contentXtra">{t('calculator.settings.contentXtra')}</label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="voucherXtra"
                      checked={formData.voucherXtra}
                      onChange={(e) => setFormData(prev => ({ ...prev, voucherXtra: e.target.checked }))}
                    />
                    <label htmlFor="voucherXtra">{t('calculator.settings.voucherXtra')}</label>
                  </div>
                </div>
              </div>
          </div>

          {/* Chi phí dự tính */}
              <div className="cost-section">
            <div className="section-title">
              <TrendingUp className="section-icon" />
              {t('calculator.costs.title')}
            </div>

                <div className="cost-inputs">
                  {/* Lợi nhuận mong muốn và Chi phí marketing */}
                  <div className="cost-inputs-row">
              {/* Lợi nhuận mong muốn */}
                    <div className="form-group inline">
                <label>
                  {t('calculator.costs.desiredProfitPercent')}
                  <Info 
                    className="info-icon" 
                    onMouseEnter={() => setShowProfitTooltip(true)}
                    onMouseLeave={() => setShowProfitTooltip(false)}
                  />
                                    {showProfitTooltip && (
                    <div className="tooltip">
                      Tỷ lệ lợi nhuận mong muốn trên giá bán (ví dụ: 15.50%).
                      <div className="tooltip-arrow"></div>
                    </div>
                  )}
                  <span className="required">*</span>
                </label>
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
                  placeholder={t('calculator.costs.desiredProfitPercentPlaceholder')}
                  className={errors.desiredProfitPercent ? 'error' : ''}
                />
                {errors.desiredProfitPercent && <div className="error-message">{errors.desiredProfitPercent}</div>}
              </div>

              {/* Chi phí marketing */}
              <div className="form-group inline">
                <label>
                  {t('calculator.costs.adCost')}
                  <Info 
                    className="info-icon" 
                    onMouseEnter={() => setShowMarketingTooltip(true)}
                    onMouseLeave={() => setShowMarketingTooltip(false)}
                  />
                  {showMarketingTooltip && (
                    <div className="tooltip">
                      Chi phí quảng cáo, afiliate, voucher trên giá bán (ví dụ: 5.5%).
                      <div className="tooltip-arrow"></div>
                    </div>
                  )}
                </label>
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
                  placeholder={t('calculator.costs.adCostPlaceholder')}
                  className={errors.marketingCostPercent ? 'error' : ''}
                />
                {errors.marketingCostPercent && <div className="error-message">{errors.marketingCostPercent}</div>}
              </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút tính toán - Nằm ngoài box */}
            <div className="calculate-button-container">
            <button 
              className="calculate-btn" 
              onClick={handleCalculate}
            >
              <TrendingUp className="btn-icon" />
              {t('calculator.form.calculate')}
            </button>
            </div>
          </div>

          {/* Kết quả tính toán */}
          {showResult && calculationResult && (
            <div id="resultSection" className="result-section">
              <div className="result-header">
                <h2>
                  <CalculatorIcon className="result-icon" />
                  {t('calculator.results.title')}
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
                        {t('calculator.results.estimatedCosts')}
                      </h3>
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td>{t('calculator.results.productFee')}:</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.productFee)}</td>
                          </tr>
                          <tr>
                            <td>{t('calculator.results.paymentFee')}:</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.paymentFee)}</td>
                          </tr>
                          <tr>
                            <td>{t('calculator.results.shippingCost')}:</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.shippingCost)}</td>
                          </tr>
                          <tr>
                            <td>{t('calculator.results.contentXtraFee')}:</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.contentXtraFee)}</td>
                          </tr>
                          <tr>
                            <td>{t('calculator.results.voucherXtraFee')}:</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.voucherXtraFee)}</td>
                          </tr>
                          <tr>
                            <td>{t('calculator.results.infrastructureFee')}:</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.infrastructureFee)}</td>
                          </tr>
                          <tr style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6' }}>
                            <td>{t('calculator.results.totalCosts')}:</td>
                            <td className="highlight-value" style={{ fontWeight: 'bold', textAlign: 'right', fontSize: '1rem' }}>
                              {formatCurrency(
                                calculationResult.productFee +
                                calculationResult.paymentFee +
                                calculationResult.shippingCost +
                                calculationResult.contentXtraFee +
                                calculationResult.voucherXtraFee +
                                calculationResult.infrastructureFee
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Tổng kết */}
                    <div className="result-card">
                      <h3>
                        <TrendingUp className="card-icon" />
                        {t('calculator.results.costBreakdown')}
                      </h3>
                      <table className="result-table">
                        <thead>
                          <tr>
                            <th style={{ minWidth: 180 }}>{t('calculator.results.item')}</th>
                            <th style={{ minWidth: 120 }}>{t('calculator.results.amount')}</th>
                            <th style={{ minWidth: 90 }}>{t('calculator.results.percentageOnPrice')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Hàng 1: Giá vốn sản phẩm */}
                          <tr>
                            <td>{t('calculator.results.costPrice')}</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.cogs)}</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatPercentage(calculationResult.finalPrice ? (calculationResult.cogs / calculationResult.finalPrice) * 100 : 0)}</td>
                          </tr>
                          {/* Hàng 2: Chi phí dự kiến */}
                          <tr>
                            <td colSpan={3} style={{ fontWeight: 600, color: '#2c3e50', backgroundColor: '#f8f9fa' }}>{t('calculator.results.estimatedCosts')}:</td>
                          </tr>
                          {/* Hàng20.1: Chi phí Shopee (tổng các phí Shopee) */}
                          <tr>
                            <td style={{ paddingLeft: 20 }}>{t('calculator.results.shopeeCosts')}:</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(
                              calculationResult.productFee +
                              calculationResult.paymentFee +
                              calculationResult.shippingCost +
                              calculationResult.contentXtraFee +
                              calculationResult.voucherXtraFee +
                              calculationResult.infrastructureFee
                            )}</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatPercentage(calculationResult.finalPrice ? (
                              (
                                calculationResult.productFee +
                                calculationResult.paymentFee +
                                calculationResult.shippingCost +
                                calculationResult.contentXtraFee +
                                calculationResult.voucherXtraFee +
                                calculationResult.infrastructureFee
                              ) / calculationResult.finalPrice
                            ) * 100 : 0)}</td>
                          </tr>
                          {/* Hàng 2.2: Chi phí Marketing (nếu có) */}
                          {calculationResult.marketingCost > 0 && (
                            <tr>
                              <td style={{ paddingLeft: 20 }}>{t('calculator.costs.adCost')}:</td>
                              <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.marketingCost)}</td>
                              <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatPercentage(calculationResult.finalPrice ? (calculationResult.marketingCost / calculationResult.finalPrice) * 100 : 0)}</td>
                            </tr>
                          )}
                          {/* Hàng 3: Lợi nhuận */}
                          <tr>
                            <td>{t('calculator.results.profit')}:</td>
                            <td className={`highlight-value ${calculationResult.profit >= 0 ? 'profit-positive' : 'profit-negative'}`} style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.profit)}</td>
                            <td className={`highlight-value ${calculationResult.profit >= 0 ? 'profit-positive' : 'profit-negative'}`} style={{ textAlign: 'right', fontSize: '1rem' }}>{formatPercentage(calculationResult.finalPrice ? (calculationResult.profit / calculationResult.finalPrice) * 100 : 0)}</td>
                          </tr>
                          {/* Hàng VAT */}
                          <tr>
                            <td>VAT (1.5%):</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatCurrency(calculationResult.vatFee)}</td>
                            <td className="highlight-value" style={{ textAlign: 'right', fontSize: '1rem' }}>{formatPercentage(calculationResult.finalPrice ? (calculationResult.vatFee / calculationResult.finalPrice) * 100 : 0)}</td>
                          </tr>
                          {/* Hàng cuối: Giá bán cuối cùng */}
                          <tr className="final-price-row">
                            <td><strong>{t('calculator.results.finalPrice')}:</strong></td>
                            <td className="highlight-value" style={{ fontSize: '1.3rem', fontWeight: 'bold', textAlign: 'right' }}>{formatCurrency(calculationResult.finalPrice)}</td>
                            <td className="highlight-value" style={{ fontSize: '1.3rem', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              {formatPercentage(100)}
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
              <a href="tel:+84789 282 979" className="consultation-btn zalo">
                <Phone />
                Hotline: 0789 282 979
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 