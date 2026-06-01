# Báo Cáo Lỗi Trình Duyệt PDF (PDF Viewer Issue Report)

## 1. Giới thiệu dự án
- **Tên tính năng:** PDF Word Explainer (thuộc ứng dụng VocabMind).
- **Mô tả:** Hệ thống cho phép người dùng tải lên một tài liệu PDF. Người dùng có thể bôi đen (highlight) một từ hoặc một đoạn văn bản trực tiếp trong trình xem PDF. Sau đó, một trợ lý AI ở khung bên cạnh (AI Explanation Chat) sẽ nhận đoạn text đã chọn và đưa ra giải thích chi tiết (tương tự trải nghiệm trên trang `alphaxiv.org`).

## 2. Tình trạng hiện tại (Bug/Issue)
- **Vấn đề gặp phải:** Lỗi hiển thị văn bản (Text rendering issue / Overlapping text) trong component **PDF Viewer**.
- **Mô tả chi tiết:** - Khi tải file PDF (ví dụ: `LSTM_recognition.pdf`) lên hệ thống, phần nội dung văn bản bên trong khung PDF Viewer hiển thị hoàn toàn bị vỡ và đè lên nhau.
  - Các dòng chữ, đoạn văn xô lệch, chồng chéo tạo thành các khối chữ đen kịt, không thể đọc được nội dung gốc của bài báo.
  - **Hệ quả:** Do văn bản không hiển thị đúng vị trí và cấu trúc, người dùng không thể thực hiện thao tác bôi đen (highlight) chính xác các từ/câu để gửi yêu cầu cho AI.
  
*(Dựa trên hình ảnh chụp màn hình, nguyên nhân phổ biến thường do thư viện render PDF - ví dụ như `pdf.js` hoặc `react-pdf` - đang gặp vấn đề trong việc đồng bộ giữa lớp hình ảnh (Canvas Layer) và lớp văn bản (Text Layer), hoặc lớp CSS của Text Layer chưa được import đúng cách khiến các thẻ text bị gom lại một chỗ).*

## 3. Mục tiêu mong muốn (Expected Behavior)
Để hoàn thiện tính năng "PDF Word Explainer", hệ thống cần đạt được các mục tiêu sau:

1. **Hiển thị PDF chuẩn xác (Fix Rendering):**
   - Nội dung file PDF phải được hiển thị sắc nét, đúng hoàn toàn với định dạng, bố cục, khoảng cách dòng và font chữ của file gốc (giống như khi mở bằng Chrome hay Adobe Reader).
   - Chữ không bị chồng chéo hay xô lệch.

2. **Tương tác Highlight mượt mà (Accurate Text Selection):**
   - Lớp văn bản (Text Layer) phải khớp chính xác với lớp hiển thị trực quan (Canvas).
   - Người dùng có thể dùng chuột quét/bôi đen từ hoặc câu một cách trơn tru, chính xác.
   
3. **Luồng dữ liệu AI thông suốt (Data Flow):**
   - Sau khi bôi đen, hệ thống trích xuất đúng đoạn text đó (không bị dính ký tự rác hay xuống dòng sai) và truyền sang khung "AI Explanation Chat" để xử lý giải thích.
