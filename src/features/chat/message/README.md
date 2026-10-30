# Message module

Phụ trách mọi thứ ở **cấp tin nhắn** của tính năng Chat.

## Trách nhiệm (dự kiến)

- Danh sách tin nhắn và hiển thị từng tin nhắn.
- Soạn và gửi tin nhắn.
- Tin nhắn văn bản và đa phương tiện.
- Gọi API cấp tin nhắn.
- State và hook liên quan đến tin nhắn.

## Không thuộc module này

- Danh sách hội thoại, chọn hoặc tìm hội thoại: thuộc `../conversation/`.
- Không import trực tiếp code nội bộ của `../conversation/`. Việc ghép hai module do `../pages/chat-page.tsx` đảm nhiệm.

## Cách tổ chức khi bắt đầu code

Chỉ tạo thư mục khi có file thật để đặt vào:

```
message/
├── components/   # UI danh sách tin nhắn, ô soạn tin
├── hooks/        # hook riêng cho tin nhắn
├── services/     # gọi API tin nhắn
└── types/        # kiểu dữ liệu, chỉ định nghĩa khi đã biết data contract
```

Quy ước chung: component đặt tên PascalCase, tên file kebab-case.
