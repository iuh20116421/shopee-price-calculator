// Các hằng số phí cố định
export const FIXED_FEES = {
  PAYMENT_FEE_PERCENT: 0, // 4.91%
  CONTENT_XTRA_FEE_PERCENT: 0, // 2.59% (max 50,000 VND cho Mall)
  CONTENT_XTRA_FEE_MAX: 0, // 50,000 VND cho Mall
  VOUCHER_XTRA_FEE_PERCENT: 0, // 1.96%
  SHIPPING_COST_PI_SHIP: 0, // 1,620 VND cho Pi ship
  INFRASTRUCTURE_FEE: 0, // 3,000 VND phí hạ tầng
  VAT_PERCENT: 0, // 1.5% VAT
};

// Interface cho input tính toán
export interface CalculationInput {
  cogs: number; // Giá vốn sản phẩm (VND)
  productFeePercent: number; // Phí cố định sản phẩm (%)
  shopeeType: 'mall' | 'regular'; // Loại shop
  marketingCostPercent?: number; // Chi phí marketing (%)
  desiredProfitPercent: number; // Lợi nhuận mong muốn (%)
  piShip: 'yes' | 'no'; // Có Pi ship hay không
  contentXtra: boolean; // Có Content Xtra
  voucherXtra: boolean; // Có Voucher Xtra
  fixedFees?: {
    PAYMENT_FEE_PERCENT: number;
    CONTENT_XTRA_FEE_PERCENT: number;
    CONTENT_XTRA_FEE_MAX: number;
    VOUCHER_XTRA_FEE_PERCENT: number;
    SHIPPING_COST_PI_SHIP: number;
    INFRASTRUCTURE_FEE: number;
    VAT_PERCENT: number;
  }; // Dữ liệu phí từ Google Sheets (optional)
}

// Interface cho kết quả tính toán
export interface CalculationResult {
  // Chi phí Shopee
  productFee: number;
  paymentFee: number;
  shippingCost: number;
  contentXtraFee: number;
  voucherXtraFee: number;
  infrastructureFee: number;
  vatFee: number;
  marketingCost: number;
  profit: number;
  
  // Tổng kết
  cogs: number;
  totalCost: number;
  finalPrice: number;
  profitMargin: number;
  
  // Validation
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Tính toán giá bán cuối cùng dựa trên công thức:
 * a = cogs + (phí cố định*a + PAYMENT_FEE_PERCENT*a + SHIPPING_COST_PI_SHIP*a + CONTENT_XTRA_FEE_PERCENT*a + VOUCHER_XTRA_FEE_PERCENT*a + phí hạ tầng) + chi phí marketing*a + VAT*a + lợi nhuận mong muốn*a
 */
export function calculateSellingPrice(input: CalculationInput): CalculationResult {
  try {
    // Validate input
    if (input.cogs <= 0) {
      return {
        ...getEmptyResult(),
        isValid: false,
        errorMessage: 'Giá vốn sản phẩm phải lớn hơn 0'
      };
    }

    if (input.productFeePercent < 0) {
      return {
        ...getEmptyResult(),
        isValid: false,
        errorMessage: 'Phí cố định sản phẩm không hợp lệ'
      };
    }

    if (input.desiredProfitPercent < 0) {
      return {
        ...getEmptyResult(),
        isValid: false,
        errorMessage: 'Lợi nhuận mong muốn không hợp lệ'
      };
    }

    if (input.marketingCostPercent && input.marketingCostPercent < 0) {
      return {
        ...getEmptyResult(),
        isValid: false,
        errorMessage: 'Chi phí marketing không hợp lệ'
      };
    }

    // Sử dụng fixedFees từ input hoặc fallback về FIXED_FEES cứng
    const fees = input.fixedFees || FIXED_FEES;

    // Tính tổng phí phần trăm
    const totalFeePercent = calculateTotalFeePercent(input, fees);

    // Kiểm tra xem tổng % có vượt quá 100% không
    const totalPercent = totalFeePercent / 100;
    if (totalPercent >= 1) {
      return {
        ...getEmptyResult(),
        isValid: false,
        errorMessage: 'Tổng phí không thể vượt quá 100%'
      };
    }

    // Tính giá bán cuối cùng
    // a = cogs + (tổng phí % * a + phí cố định) / (1 - tổng phí %)
    const fixedCosts = fees.INFRASTRUCTURE_FEE + 
                      (input.piShip === 'yes' ? fees.SHIPPING_COST_PI_SHIP : 0);
    
    const sellingPrice = (input.cogs + fixedCosts) / (1 - totalPercent);

    // Tính các phí dựa trên giá bán
    const productFee = sellingPrice * (input.productFeePercent / 100);
    const paymentFee = sellingPrice * (fees.PAYMENT_FEE_PERCENT / 100);
    const shippingCost = input.piShip === 'yes' ? fees.SHIPPING_COST_PI_SHIP : 0;
    
    // Content Xtra Fee - max 50,000 VND chỉ cho Mall
    let contentXtraFee = 0;
    if (input.contentXtra) {
      const contentXtraFeePercent = sellingPrice * (fees.CONTENT_XTRA_FEE_PERCENT / 100);
      if (input.shopeeType === 'mall') {
        contentXtraFee = Math.min(contentXtraFeePercent, fees.CONTENT_XTRA_FEE_MAX);
      } else {
        contentXtraFee = contentXtraFeePercent; // Regular tính theo %
      }
    }
    
    const voucherXtraFee = input.voucherXtra ? sellingPrice * (fees.VOUCHER_XTRA_FEE_PERCENT / 100) : 0;
    const infrastructureFee = fees.INFRASTRUCTURE_FEE;
    const vatFee = sellingPrice * (fees.VAT_PERCENT / 100);
    const marketingCost = input.marketingCostPercent ? sellingPrice * (input.marketingCostPercent / 100) : 0;
    const profit = sellingPrice * (input.desiredProfitPercent / 100);

    // Tính tổng chi phí
    const totalCost = input.cogs + productFee + paymentFee + shippingCost + 
                     contentXtraFee + voucherXtraFee + infrastructureFee + 
                     vatFee + marketingCost;

    // Tính lợi nhuận thực tế
    const actualProfit = sellingPrice - totalCost;
    const profitMargin = (actualProfit / sellingPrice) * 100;

    return {
      // Chi phí Shopee
      productFee,
      paymentFee,
      shippingCost,
      contentXtraFee,
      voucherXtraFee,
      infrastructureFee,
      vatFee,
      marketingCost,
      profit: actualProfit,
      
      // Tổng kết
      cogs: input.cogs,
      totalCost,
      finalPrice: sellingPrice,
      profitMargin,
      
      isValid: true
    };

  } catch (error) {
    return {
      ...getEmptyResult(),
      isValid: false,
      errorMessage: 'Có lỗi xảy ra trong quá trình tính toán'
    };
  }
}

/**
 * Tính tổng phí phần trăm
 */
function calculateTotalFeePercent(input: CalculationInput, fees: typeof FIXED_FEES): number {
  let totalFeePercent = input.productFeePercent + 
                       fees.PAYMENT_FEE_PERCENT + 
                       fees.VAT_PERCENT +
                       input.desiredProfitPercent;

  if (input.contentXtra) {
    totalFeePercent += fees.CONTENT_XTRA_FEE_PERCENT;
  }

  if (input.voucherXtra) {
    totalFeePercent += fees.VOUCHER_XTRA_FEE_PERCENT;
  }

  if (input.marketingCostPercent) {
    totalFeePercent += input.marketingCostPercent;
  }

  return totalFeePercent;
}

/**
 * Tạo kết quả rỗng
 */
function getEmptyResult(): Omit<CalculationResult, 'isValid' | 'errorMessage'> {
  return {
    productFee: 0,
    paymentFee: 0,
    shippingCost: 0,
    contentXtraFee: 0,
    voucherXtraFee: 0,
    infrastructureFee: 0,
    vatFee: 0,
    marketingCost: 0,
    profit: 0,
    cogs: 0,
    totalCost: 0,
    finalPrice: 0,
    profitMargin: 0,
  };
}

/**
 * Format số tiền thành chuỗi VND
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format phần trăm
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)} %`;
}

/**
 * Parse chuỗi phí thành số
 */
export function parseFeeString(feeString: string): number {
  const match = feeString.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Validate input tiền tệ
 */
export function validateMoneyInput(value: string): boolean {
  const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
  return !isNaN(numValue) && numValue >= 0;
}

/**
 * Validate input phần trăm
 */
export function validatePercentageInput(value: string): boolean {
  const numValue = parseFloat(value.replace(/[^\d.-]/g, ''));
  return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
} 