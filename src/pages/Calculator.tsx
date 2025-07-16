import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator as CalculatorIcon, Box, Store, TrendingUp, Facebook, Phone, Search } from 'lucide-react';
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
      newErrors.product = 'Vui lòng chọn ngành hàng';
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
          {/* Thông tin sản phẩm - Full width */}
          <div className="form-section wide">
            <div className="section-title">
              <Box className="section-icon" />
              Thông tin sản phẩm
            </div>

            <div className="product-info-grid">
              {/* Loại Shopee và Tên sản phẩm */}
              <div className="product-info-row">
                {/* Loại Shopee */}
                <div className="form-group inline">
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

                {/* Tên sản phẩm */}
                <div className="form-group">
                  <label>Tên sản phẩm:<span className="required">*</span></label>
                  <div className="product-search-container">
                    <div className="search-input-wrapper">
                      <Search className="search-icon" />
                      <input
                        name="product"
                        type="text"
                        value={productName}
                        onChange={(e) => handleProductNameChange(e.target.value)}
                        placeholder="Nhập tên sản phẩm để tìm kiếm..."
                        className={`search-input ${errors.product ? 'error' : ''}`}
                      />
                      {isSearching && <div className="searching-indicator">Đang tìm...</div>}
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
              </div>

              {/* Chọn ngành hàng */}
              <div className="form-group">
                <label>Chọn ngành hàng:<span className="required">*</span></label>
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
                    <strong>Sản phẩm đã chọn:</strong> {selectedProduct.name}
                  </div>
                  <div className="selected-product-path">
                    <strong>Ngành hàng:</strong> {selectedProduct.path.join(' > ')}
                  </div>
                  <div className="selected-product-fee">
                    <strong>Phí cố định:</strong> {selectedProduct.fee}
                  </div>
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
          </div>

          {/* Cài đặt Shopee và Chi phí dự tính - Combined */}
          <div className="form-section wide">
            <div className="settings-cost-layout">
              {/* Cài đặt Shopee */}
              <div className="settings-section">
                <div className="section-title">
                  <Store className="section-icon" />
                  Cài đặt Shopee
                </div>

                {/* Pi Ship */}
                <div className="form-group inline">
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
                      <label htmlFor="piShipYes">Có</label>
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

                {/* Content Xtra và Voucher Xtra */}
                <div className="form-group inline">
                  <label>Dịch vụ Extra:</label>
                  <div className="checkbox-group">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="contentXtra"
                        checked={formData.contentXtra}
                        onChange={(e) => setFormData(prev => ({ ...prev, contentXtra: e.target.checked }))}
                      />
                      <label htmlFor="contentXtra">Content Xtra</label>
                    </div>
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="voucherXtra"
                        checked={formData.voucherXtra}
                        onChange={(e) => setFormData(prev => ({ ...prev, voucherXtra: e.target.checked }))}
                      />
                      <label htmlFor="voucherXtra">Voucher Xtra</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chi phí dự tính */}
              <div className="cost-section">
                <div className="section-title">
                  <TrendingUp className="section-icon" />
                  Chi phí dự tính
                </div>

                <div className="cost-inputs">
                  {/* Lợi nhuận mong muốn và Chi phí marketing */}
                  <div className="cost-inputs-row">
                    {/* Lợi nhuận mong muốn */}
                    <div className="form-group inline">
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
                    <div className="form-group inline">
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
                Tính Giá Bán
              </button>
            </div>
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