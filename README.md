# App Chat

## Hướng dẫn cấu hình Cloudinary

Ứng dụng dùng Cloudinary để tải ảnh và video trong cuộc trò chuyện. Trước khi chạy ứng dụng, hãy cấu hình một **unsigned upload preset** trong Cloudinary và đặt hai biến môi trường sau:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

### Lấy Cloud name

1. Đăng nhập vào [Cloudinary Console](https://console.cloudinary.com/).
2. Trên trang Dashboard, sao chép giá trị **Cloud name**.
3. Dán giá trị đó vào `VITE_CLOUDINARY_CLOUD_NAME`.

### Tạo upload preset

1. Trong Cloudinary Console, mở **Settings** → **Upload**.
2. Tìm phần **Upload presets** và chọn **Add upload preset**.
3. Đặt **Signing Mode** là **Unsigned** để trình duyệt có thể tải file trực tiếp mà không cần API secret.
4. Lưu preset và sao chép **Upload preset name** vào `VITE_CLOUDINARY_UPLOAD_PRESET`.

### Tạo file môi trường

Tạo file `.env` ở thư mục gốc dự án. Có thể sao chép `.env.example` rồi điền hai giá trị Cloudinary vào đó. Không thêm dấu nháy quanh giá trị.

Sau khi thay đổi `.env`, hãy khởi động lại máy chủ phát triển:

```bash
npm run dev
```

`.env` đã được Git bỏ qua; chỉ commit `.env.example`, không commit file `.env` chứa cấu hình môi trường cá nhân.

### Giới hạn upload hiện tại

- Ảnh: JPG/JPEG, PNG, WEBP; tối đa 10 MB.
- Video: MP4, WEBM; tối đa 50 MB.

## Chạy ứng dụng

```bash
npm install
npm run dev
```
