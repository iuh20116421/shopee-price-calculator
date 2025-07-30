# Deployment Guide for Vercel

## Các thay đổi đã thực hiện để sửa lỗi deployment:

### 1. Cập nhật TypeScript version
- Thay đổi từ `typescript: "^4.9.5"` thành `typescript: "^5.8.3"`
- Cập nhật `@types/jest` và `@types/node` để tương thích

### 2. Downgrade React version
- Thay đổi từ React 19 về React 18.2.0 để tương thích với react-scripts 5.0.1
- Cập nhật react-router-dom về phiên bản 6.22.3

### 3. Tạo file .npmrc
```
legacy-peer-deps=true
```

### 4. Tạo file vercel.json
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "create-react-app",
  "outputDirectory": "build"
}
```

### 5. Cập nhật package.json
- Thêm `engines` field để chỉ định phiên bản Node.js 18.x
- Thêm `overrides` để fix ajv và ajv-keywords conflicts
- Thêm axios dependency

### 6. Tạo file .nvmrc
```
18.20.0
```

### 7. Tạo file .vercelignore
Để loại trừ các file không cần thiết khi deploy

## Cách deploy:

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động sử dụng cấu hình trong `vercel.json`
4. Build sẽ sử dụng `--legacy-peer-deps` để tránh xung đột dependencies

## Lưu ý:
- Lỗi ban đầu là do xung đột giữa TypeScript 4.x và i18next yêu cầu TypeScript 5.x
- Sử dụng `--legacy-peer-deps` để bỏ qua kiểm tra peer dependencies nghiêm ngặt
- Đảm bảo Node.js version 18.x (không phải 22.x)
- React 18 tương thích tốt hơn với react-scripts 5.0.1 