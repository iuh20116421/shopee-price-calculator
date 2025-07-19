# CSS Structure Documentation

## Overview
CSS đã được refactor thành các file riêng biệt để dễ quản lý và debug hơn.

## Cấu trúc thư mục

```
src/styles/
├── index.css              # File chính import tất cả CSS
├── base.css               # Reset, utilities, common styles
├── components/            # CSS cho các components
│   ├── header.css
│   ├── footer.css
│   ├── language-switcher.css
│   ├── category-selector.css
│   └── toast.css
├── pages/                 # CSS cho các trang
│   ├── home.css
│   └── calculator.css
└── README.md             # File này
```

## Chi tiết từng file

### base.css
- Reset CSS và base styles
- Utility classes (Tailwind-like)
- Common button styles
- CSS variables
- Responsive utilities

### components/
- **header.css**: Styles cho Header component
- **footer.css**: Styles cho Footer component  
- **language-switcher.css**: Styles cho LanguageSwitcher component
- **category-selector.css**: Styles cho CategorySelector component
- **toast.css**: Styles cho toast notifications

### pages/
- **home.css**: Styles cho trang Home
- **calculator.css**: Styles cho trang Calculator

## Cách sử dụng

### Thêm CSS mới cho component
1. Tạo file CSS trong thư mục `components/`
2. Import file trong `index.css`

### Thêm CSS mới cho trang
1. Tạo file CSS trong thư mục `pages/`
2. Import file trong `index.css`

### Thêm utility classes
1. Thêm vào file `base.css`
2. Sử dụng theo format Tailwind CSS

## Best Practices

1. **Naming Convention**: Sử dụng kebab-case cho class names
2. **Organization**: Nhóm các styles liên quan lại với nhau
3. **Responsive**: Luôn thêm responsive styles cho mobile
4. **Comments**: Thêm comments để giải thích các section phức tạp
5. **Variables**: Sử dụng CSS variables cho colors và common values

## Migration từ file cũ

File `index.css` cũ đã được tách thành các file nhỏ hơn:
- Các styles chung → `base.css`
- Header styles → `components/header.css`
- Footer styles → `components/footer.css`
- Calculator styles → `pages/calculator.css`
- Home styles → `pages/home.css`

## Lợi ích của cấu trúc mới

1. **Dễ debug**: Mỗi component/trang có file CSS riêng
2. **Dễ maintain**: Không cần scroll qua file CSS dài
3. **Team collaboration**: Ít conflict khi nhiều người cùng làm
4. **Performance**: Chỉ load CSS cần thiết
5. **Scalability**: Dễ dàng mở rộng khi thêm components/pages mới 