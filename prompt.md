Tôi đang phát triển một web app hỗ trợ học tiếng Anh.
Hiện tại hệ thống đã có:
- PDF/Paper Viewer ở bên trái.
- AI Chat Assistant ở bên phải.
- Chức năng highlight (bôi đen) text trong PDF.
- Khi người dùng highlight text, hệ thống đã lấy được nội dung được chọn.
- AI đã có khả năng giải thích ngữ nghĩa của đoạn text được chọn.

Tôi muốn cải thiện UX để hoạt động giống giao diện của Gemini Paper Reader / Humata / ChatPDF/alphaxiv.

# Mục tiêu
Khi người dùng bôi đen một đoạn văn trong PDF:

Đoạn văn được chọn phải xuất hiện ở phía trên ô chat dưới dạng một "Context Card".
Card này hiển thị:
- Số trang (nếu có).
- Nội dung được highlight (rút gọn nếu quá dài).
- Nút đóng (X) để bỏ context.
Khi người dùng gửi tin nhắn:
- Context card hiện tại phải được gửi kèm request tới AI.
- AI hiểu rằng câu hỏi đang liên quan tới đoạn được highlight.
Nếu người dùng bỏ context card:
- Tin nhắn tiếp theo chỉ dùng nội dung chat thông thường.

Ví dụ về giao diện tương tự:
- Gemini Paper Reader
- Humata
- ChatPDF
- alphaxiv

# UI
UI phải giống các sản phẩm đọc paper hiện đại:
- Context card nằm ngay phía trên ô nhập chat.
- Bo góc.
- Có border nhẹ .
- Có hiệu ứng hover.
- Responsive.