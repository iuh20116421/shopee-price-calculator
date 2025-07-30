# Deployment Guide for Vercel

## Các thay đổi đã thực hiện để sửa lỗi deployment:

### 1. Cấu hình Node.js và React-scripts
- Node.js: 18.x (yêu cầu bắt buộc của Vercel)
- React-scripts: 5.0.1 (tương thích với Node.js 18)
- TypeScript: 5.8.3 (tương thích với react-scripts 5.0.1)

### 2. Cập nhật dependencies
- Sử dụng các phiên bản mới nhất tương thích với Node.js 18
- Cập nhật @types và testing libraries

### 3. Fix ajv conflicts
- Thêm `resolutions` trong package.json để fix phiên bản ajv và ajv-keywords
- Sử dụng ajv ^8.12.0, ajv-keywords ^5.1.0, và schema-utils ^4.2.0
- Tạo file .yarnrc để đảm bảo yarn sử dụng resolutions

### 4. Cấu hình Vercel (Static Build)
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
  ],
  "env": {
    "NPM_FLAGS": "--legacy-peer-deps"
  }
}
```

### 5. Cập nhật package.json
- Thêm `engines` field để chỉ định Node.js 18.x (yêu cầu của Vercel)
- Sử dụng react-scripts 5.0.1 và TypeScript 5.8.3
- Cập nhật tất cả dependencies lên phiên bản mới nhất
- Thêm `resolutions` để fix ajv conflicts

### 6. Tạo file .nvmrc
```
18.20.0
```

### 7. Cập nhật .npmrc
```
legacy-peer-deps=true
```

### 8. Tạo file .yarnrc
```
--ignore-engines true
```

## Cách deploy:

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Vercel sẽ tự động sử dụng cấu hình trong `vercel.json`
4. Build sẽ sử dụng Node.js 18.x và react-scripts 5.0.1

## Lưu ý:
- Node.js 18.x là yêu cầu bắt buộc của Vercel
- React-scripts 5.0.1 tương thích tốt với Node.js 18
- Sử dụng `--legacy-peer-deps` để tránh xung đột dependencies
- Sử dụng `resolutions` để fix ajv và ajv-keywords conflicts
- Sử dụng @vercel/static-build để build static site
- Cấu hình routes để hỗ trợ React Router 