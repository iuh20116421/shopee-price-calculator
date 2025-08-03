export interface ConsultationData {
  fullName: string;
  phoneNumber: string;
  shopIssue: string;
  shopLink: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  message: string;
  rowNumber?: number;
}

class GoogleSheetsService {
  private readonly baseUrl: string;

  constructor() {
    // URL của Google Apps Script Web App - sẽ được cung cấp sau khi tạo script
    this.baseUrl = process.env.REACT_APP_GOOGLE_APPS_SCRIPT_URL || '';
  }

  async submitConsultation(data: ConsultationData): Promise<GoogleSheetsResponse> {
    try {
      if (!this.baseUrl) {
        throw new Error('Google Apps Script URL not configured');
      }

      const payload = {
        fullName: data.fullName.trim(),
        phoneNumber: data.phoneNumber.trim(),
        shopIssue: data.shopIssue.trim(),
        shopLink: data.shopLink.trim(),
        timestamp: new Date().toISOString()
      };

      // Use JSONP to bypass CORS issues
      const result = await this.makeJSONPRequest(payload);
      return result;
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private makeJSONPRequest(payload: any): Promise<GoogleSheetsResponse> {
    return new Promise((resolve, reject) => {
      // Create a unique callback name
      const callbackName = `googleSheetsCallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create callback function
      (window as any)[callbackName] = (response: GoogleSheetsResponse) => {
        // Clean up
        delete (window as any)[callbackName];
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        resolve(response);
      };

      // Create script element
      const script = document.createElement('script');
      
      // Build URL with parameters for JSONP
      const params = new URLSearchParams();
      params.append('callback', callbackName);
      
      // Add payload parameters
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          params.append(key, String(payload[key]));
        }
      });
      
      const fullUrl = `${this.baseUrl}?${params.toString()}`;
      
      script.src = fullUrl;
      
      // Handle errors
      script.onerror = (error) => {
        console.error('JSONP script load error:', error);
        delete (window as any)[callbackName];
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        reject(new Error(`Failed to load Google Apps Script. Check URL and deployment settings.`));
      };
      
      // Set timeout
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName];
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
          reject(new Error('Request timeout - Google Apps Script did not respond within 15 seconds'));
        }
      }, 15000);
      
      // Add script to head to make the request
      document.head.appendChild(script);
    });
  }

  // Test method để kiểm tra kết nối
  async testConnection(): Promise<boolean> {
    try {
      if (!this.baseUrl) return false;
      
      const result = await this.makeJSONPRequest({
        test: true,
        timestamp: new Date().toISOString()
      });
      
      return result.success !== false;
    } catch {
      return false;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();