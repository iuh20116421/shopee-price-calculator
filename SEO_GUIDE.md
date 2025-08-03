# Hướng dẫn SEO cho TukiLab

## 1. Google Search Console Setup

### Bước 1: Đăng ký Google Search Console
1. Truy cập https://search.google.com/search-console
2. Đăng nhập bằng tài khoản Google
3. Thêm property: `https://www.tukilab.asia/`
4. Xác minh quyền sở hữu bằng một trong các cách:
   - HTML tag
   - DNS record
   - Google Analytics
   - Google Tag Manager

### Bước 2: Submit Sitemap
1. Sau khi xác minh thành công, vào "Sitemaps"
2. Submit URL: `https://www.tukilab.asia/sitemap.xml`

## 2. Google Analytics Setup

### Bước 1: Tạo Google Analytics 4
1. Truy cập https://analytics.google.com/
2. Tạo property mới cho `tukilab.asia`
3. Lấy Measurement ID (GA4-XXXXXXXXX)

### Bước 2: Thêm Google Analytics vào website
Thêm script sau vào `<head>` của `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 3. Content Optimization

### Bước 1: Tối ưu nội dung trang chủ
- Thêm từ khóa "TukiLab" vào tiêu đề, mô tả
- Tạo nội dung chất lượng về công cụ tính giá Shopee
- Thêm FAQ section với từ khóa "tukilab"

### Bước 2: Tạo trang About/About Us
Tạo trang giới thiệu với nội dung:
- Lịch sử TukiLab
- Mục tiêu và sứ mệnh
- Đội ngũ phát triển
- Liên hệ

### Bước 3: Tạo Blog/Articles
Viết các bài viết liên quan:
- "Hướng dẫn sử dụng TukiLab tính giá Shopee"
- "Lợi ích của việc sử dụng công cụ tính giá Shopee"
- "So sánh các công cụ tính giá Shopee"

## 4. Technical SEO

### Bước 1: Page Speed Optimization
1. Tối ưu hình ảnh (compress, WebP format)
2. Minify CSS/JS files
3. Enable Gzip compression
4. Sử dụng CDN

### Bước 2: Mobile Optimization
- Đảm bảo website responsive
- Test trên Google PageSpeed Insights
- Đạt điểm 90+ trên mobile

### Bước 3: Schema Markup
Thêm structured data vào website:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "TukiLab - Shopee Price Calculator",
  "description": "Công cụ tính giá Shopee chính xác và nhanh chóng",
  "url": "https://www.tukilab.asia",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND"
  }
}
</script>
```

## 5. Backlink Building

### Bước 1: Local Business Listings
- Đăng ký Google My Business
- Thêm vào các thư mục doanh nghiệp Việt Nam
- Đăng ký trên các platform như: VnExpress, Dantri, etc.

### Bước 2: Social Media
- Tạo fanpage Facebook: "TukiLab"
- Tạo kênh YouTube: "TukiLab Official"
- Tạo tài khoản LinkedIn
- Tạo Twitter/X account

### Bước 3: Guest Posting
- Viết bài guest post trên các blog về e-commerce
- Đăng bài trên các diễn đàn Shopee seller
- Tham gia các group Facebook về bán hàng online

## 6. Local SEO

### Bước 1: Google My Business
1. Tạo Google My Business listing
2. Thêm thông tin đầy đủ:
   - Tên: TukiLab
   - Danh mục: Software Company
   - Địa chỉ: TP.HCM, Việt Nam
   - Website: https://www.tukilab.asia
   - Số điện thoại
   - Giờ làm việc

### Bước 2: Local Citations
- Đăng ký trên các thư mục địa phương
- Thêm vào các website review địa phương

## 7. Monitoring & Analytics

### Bước 1: Track Keywords
- Theo dõi từ khóa "tukilab" trên Google Search Console
- Theo dõi thứ hạng trên các công cụ như SEMrush, Ahrefs

### Bước 2: Regular Updates
- Cập nhật nội dung thường xuyên
- Thêm tính năng mới
- Tối ưu performance

## 8. Timeline

### Tuần 1-2:
- Setup Google Search Console & Analytics
- Tối ưu technical SEO
- Tạo sitemap và robots.txt

### Tuần 3-4:
- Tối ưu nội dung
- Thêm schema markup
- Tạo social media accounts

### Tuần 5-8:
- Xây dựng backlinks
- Guest posting
- Local SEO setup

### Tuần 9-12:
- Monitoring và điều chỉnh
- Tối ưu liên tục
- Mở rộng nội dung

## 9. Expected Results

Sau 3-6 tháng thực hiện đầy đủ các bước trên, website có thể:
- Xuất hiện trên trang 1 Google khi search "tukilab"
- Nhận traffic organic từ 100-1000 visitors/tháng
- Tăng brand awareness cho TukiLab

## 10. Tools Recommended

- Google Search Console
- Google Analytics
- Google PageSpeed Insights
- SEMrush (paid)
- Ahrefs (paid)
- Screaming Frog SEO Spider
- Yoast SEO (nếu dùng WordPress)

## Lưu ý quan trọng:
1. SEO là quá trình dài hạn, cần kiên nhẫn
2. Chất lượng nội dung quan trọng hơn số lượng
3. Tập trung vào user experience
4. Theo dõi và điều chỉnh thường xuyên 