# Deployment Guide for Vercel

## Các thay đổi đã thực hiện để sửa lỗi deployment:

### 1. Downgrade to stable versions
- React-scripts: 5.0.1 → 4.0.3 (ổn định hơn)
- TypeScript: 5.8.3 → 4.9.5 (tương thích với react-scripts 4.0.3)
- Node.js: 16.x → 18.x (yêu cầu của Vercel)

### 2. Cập nhật dependencies
- Downgrade các testing libraries về phiên bản tương thích
- Sử dụng @types phiên bản cũ hơn để tương thích

### 3. Cấu hình Vercel (Static Build)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Cập nhật package.json
- Thêm `engines` field để chỉ định Node.js 18.x (yêu cầu của Vercel)
- Loại bỏ `resolutions` và `overrides` để tránh conflict
- Sử dụng dependencies phiên bản ổn định

### 5. Tạo file .nvmrc
```
18.20.0
```

### 6. Cập nhật .npmrc
Loại bỏ `legacy-peer-deps` vì không cần thiết với react-scripts 4.0.3

## Cách deploy:

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động sử dụng cấu hình trong `vercel.json`
4. Build sẽ sử dụng Node.js 18.x và react-scripts 4.0.3

## Lưu ý:
- React-scripts 4.0.3 ổn định hơn và ít conflict hơn
- Node.js 18.x là yêu cầu bắt buộc của Vercel
- Loại bỏ các cấu hình phức tạp để tránh xung đột
- Sử dụng dependencies phiên bản cũ hơn nhưng ổn định
- Sử dụng @vercel/static-build để build static site
- Cấu hình routes để hỗ trợ React Router 