# Conversation module

Phụ trách mọi thứ ở **cấp hội thoại** của tính năng Chat.

## Trách nhiệm (dự kiến)

- Danh sách hội thoại và thông tin hội thoại (tên, ảnh đại diện, tin nhắn cuối, số chưa đọc).
- Chọn hội thoại, tìm kiếm hội thoại.
- Gọi API cấp hội thoại.
- State và hook liên quan đến hội thoại.

## Không thuộc module này

- Nội dung tin nhắn, hiển thị tin nhắn, ô soạn tin nhắn: thuộc `../message/`.
- Không import trực tiếp code nội bộ của `../message/`. Việc ghép hai module do `../pages/chat-page.tsx` đảm nhiệm.

## Cách tổ chức khi bắt đầu code

Chỉ tạo thư mục khi có file thật để đặt vào:

```
conversation/
├── components/   # UI của danh sách / mục hội thoại
├── hooks/        # hook riêng cho hội thoại
├── services/     # gọi API hội thoại
└── types/        # kiểu dữ liệu, chỉ định nghĩa khi đã biết data contract
```

Quy ước chung: component đặt tên PascalCase, tên file kebab-case.
