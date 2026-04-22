# Hướng dẫn sử dụng hệ thống A-Care theo phân quyền

## 1. Giới thiệu chung

Hệ thống A-Care là nền tảng quản lý lịch khám và dịch vụ phòng khám, phục vụ 3 nhóm người dùng chính:

- Bệnh nhân: đặt lịch, theo dõi lịch hẹn, xem lịch sử khám.
- Bác sĩ: quản lý lịch khám đang chờ, cập nhật kết quả khám, theo dõi thống kê.
- Quản trị viên (Admin): quản lý người dùng, dịch vụ và theo dõi số liệu tổng quan hệ thống.

Ngoài ra, khách chưa đăng nhập vẫn có thể xem trang chủ, danh sách dịch vụ, đội ngũ bác sĩ, hướng dẫn, FAQ và liên hệ.

## 2. Nguyên tắc phân quyền

- Mỗi tài khoản chỉ truy cập đúng nhóm chức năng theo vai trò.
- Nếu chưa đăng nhập mà truy cập trang nội bộ, hệ thống sẽ chuyển về trang đăng nhập.
- Nếu đăng nhập sai vai trò (ví dụ tài khoản bệnh nhân vào trang admin), hệ thống sẽ chuyển đến trang 403.
- Tài khoản đã đăng nhập không truy cập lại trang đăng nhập/đăng ký, mà được chuyển về trang chính theo vai trò.

## 3. Hướng dẫn cho Bệnh nhân

### 3.1. Mục tiêu sử dụng

Bệnh nhân dùng hệ thống để đặt lịch khám, quản lý lịch hẹn sắp tới và xem lịch sử các cuộc hẹn đã hoàn thành.

### 3.2. Các trang chính của Bệnh nhân

- Đặt lịch: /patient/book
- Thanh toán đặt khám: /patient/payment
- Lịch hẹn đang chờ: /patient/appointments
- Lịch sử khám: /patient/history
- Chỉnh sửa hồ sơ cá nhân: /patient/profile hoặc /patient/edit
- Chỉnh sửa lịch hẹn: /patient/edit-appointment/:id

### 3.3. Quy trình sử dụng đề xuất

1. Đăng nhập tài khoản bệnh nhân.
2. Vào trang Đặt lịch.
3. Chọn dịch vụ, bác sĩ, ngày khám, giờ khám.
4. Nhập lý do khám (nếu có), xác nhận hóa đơn và thanh toán theo luồng hệ thống.
5. Theo dõi lịch hẹn ở trang Lịch hẹn.
6. Khi lịch hẹn đã hoàn thành, xem lại thông tin ở trang Lịch sử.

### 3.4. Chức năng quan trọng

- Xem chi tiết lịch hẹn và thông tin dịch vụ.
- Sửa/hủy lịch hẹn khi lịch chưa hoàn thành.
- Xem thông báo liên quan đến lịch hẹn.
- Xem phòng khám của bác sĩ trong chi tiết lịch và lịch sử khám.

### 3.5. Giới hạn quyền

- Chỉ tài khoản bệnh nhân mới được đặt lịch từ trang dịch vụ.
- Bệnh nhân không truy cập được các trang của bác sĩ và admin.

## 4. Hướng dẫn cho Bác sĩ

### 4.1. Mục tiêu sử dụng

Bác sĩ dùng hệ thống để xử lý lịch khám đang chờ và theo dõi hiệu suất khám theo thời gian.

### 4.2. Các trang chính của Bác sĩ

- Lịch khám: /doctor/schedule
- Thống kê bác sĩ: /doctor/reports
- Hồ sơ cá nhân: /doctor/profile hoặc /doctor/edit

### 4.3. Chức năng nghiệp vụ chính

- Xem danh sách lịch hẹn đang chờ khám.
- Xem chi tiết bệnh nhân và dịch vụ của từng cuộc hẹn.
- Đánh dấu Khám xong để chuyển trạng thái lịch hẹn.
- Hủy lịch hẹn kèm lý do để thông báo cho bệnh nhân.
- Theo dõi dashboard thống kê cá nhân theo ngày/tháng/quý.
- Xem lịch sử khám theo từng bệnh nhân có phân trang.

### 4.4. Quy trình sử dụng đề xuất

1. Đăng nhập bằng tài khoản bác sĩ.
2. Vào trang Lịch khám để xem danh sách lịch đang chờ trong ngày/kỳ làm việc.
3. Mở Chi tiết từng lịch để kiểm tra thông tin bệnh nhân, dịch vụ và ghi chú khám.
4. Sau khi khám xong, bấm Khám xong để cập nhật trạng thái.
5. Trường hợp không thể tiếp nhận, chọn Hủy lịch và nhập lý do để hệ thống gửi thông báo cho bệnh nhân.
6. Vào trang Thống kê để theo dõi số ca khám, xu hướng theo ngày/tháng/quý và lịch sử theo từng bệnh nhân.

### 4.5. Giới hạn quyền

- Bác sĩ không truy cập được các trang quản trị admin.
- Bác sĩ không có quyền thao tác các chức năng đặt lịch như bệnh nhân.

## 5. Hướng dẫn cho Admin

### 5.1. Mục tiêu sử dụng

Admin quản trị toàn bộ dữ liệu vận hành: người dùng, dịch vụ và số liệu tổng hợp.

### 5.2. Các trang chính của Admin

- Dashboard: /admin/dashboard
- Quản lý người dùng: /admin/users
- Thêm người dùng: /admin/add-user
- Cập nhật/xem người dùng: /admin/edit-user/:id, /admin/show-user/:id
- Quản lý dịch vụ: /admin/services
- Thêm/cập nhật dịch vụ: /admin/add-service, /admin/edit-service/:id
- Thống kê hệ thống: /admin/statistics
- Hồ sơ admin: /admin/profile

### 5.3. Chức năng nghiệp vụ chính

- Quản lý tài khoản theo vai trò (PATIENT, DOCTOR, ADMIN).
- Khi tạo tài khoản bác sĩ, cấu hình thêm chuyên khoa, phòng khám, ngày làm việc, ca làm việc.
- Quản lý danh mục dịch vụ khám (thêm/sửa thông tin dịch vụ).
- Theo dõi chỉ số tổng quan: số người dùng, bác sĩ nổi bật, dịch vụ nổi bật, doanh thu theo thời gian.

### 5.4. Quy trình sử dụng đề xuất

1. Đăng nhập bằng tài khoản admin và vào Dashboard để nắm nhanh tình hình hệ thống.
2. Kiểm tra mục Người dùng, rà soát danh sách và cập nhật tài khoản theo nhu cầu vận hành.
3. Khi thêm bác sĩ mới, cấu hình đầy đủ chuyên khoa, phòng khám, ngày làm việc và ca làm việc.
4. Kiểm tra mục Dịch vụ để thêm mới/chỉnh sửa giá, mô tả và trạng thái hoạt động của dịch vụ.
5. Vào mục Thống kê để theo dõi doanh thu, lượt khám, xu hướng sử dụng dịch vụ và hiệu suất bác sĩ.
6. Thực hiện rà soát định kỳ, chuẩn hóa dữ liệu và phân quyền đúng vai trò trước mỗi đợt vận hành.

### 5.5. Giới hạn quyền

- Admin không dùng các luồng đặt lịch theo trải nghiệm bệnh nhân.
- Các thao tác quản trị cần dùng đúng tài khoản admin đã được cấp.

## 6. Điều hướng nhanh theo vai trò sau đăng nhập

- Bệnh nhân: chuyển đến /patient/book
- Bác sĩ: chuyển đến /doctor/schedule
- Admin: chuyển đến /admin/dashboard

## 7. Khuyến nghị vận hành

- Luôn cập nhật hồ sơ cá nhân đầy đủ trước khi thao tác nghiệp vụ.
- Với tài khoản bác sĩ, cần kiểm tra phòng khám và lịch làm việc để bệnh nhân đặt lịch chính xác.
- Với admin, nên rà soát dữ liệu người dùng và dịch vụ định kỳ để đảm bảo thống nhất toàn hệ thống.

