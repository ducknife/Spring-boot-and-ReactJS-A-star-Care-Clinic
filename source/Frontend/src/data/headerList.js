// Menu mặc định cho khách
const guestMenu = [
    { id: 1, to: "/", name: "Trang chủ", hasArrow: false },
    { id: 2, to: "/about", name: "Giới thiệu", hasArrow: false },
    { id: 3, to: "/services", name: "Dịch vụ", hasArrow: false },
    { id: 4, to: "/doctors", name: "Đội ngũ", hasArrow: false },
    { id: 5, to: "/instruction", name: "Hướng dẫn", hasArrow: false },
    {
        id: 6,
        to: "#",
        name: "Trang",
        hasArrow: true,
        children: [
            { id: "p1", label: "Liên hệ", to: "/contact" },
            { id: "p3", label: "Hỏi đáp", to: "/faq" },
        ],
    },
    { id: 7, to: import.meta.env.VITE_AI_URL, name: "Trợ lý A*Care", hasArrow: false, isExternal: true },
];

// Menu cho ADMIN
const adminMenu = [
    { id: 1, to: "/admin/dashboard", name: "Bảng điều khiển", hasArrow: false },
    { id: 2, to: "/admin/users", name: "Người dùng", hasArrow: false },
    { id: 3, to: "/admin/services", name: "Dịch vụ", hasArrow: false },
    { id: 4, to: "/admin/statistics", name: "Thống kê", hasArrow: false },
    { id: 5, to: import.meta.env.VITE_AI_URL, name: "Trợ lý A*Care", hasArrow: false, isExternal: true },
];

// Menu cho DOCTOR
const doctorMenu = [
    { id: 1, to: "/doctor/schedule", name: "Lịch khám", hasArrow: false },
    { id: 2, to: "/doctor/reports", name: "Thống kê", hasArrow: false },
    { id: 3, to: "/instruction", name: "Hướng dẫn", hasArrow: false },
    { id: 4, to: import.meta.env.VITE_AI_URL, name: "Trợ lý A*Care", hasArrow: false, isExternal: true },
];

// Menu cho PATIENT
const patientMenu = [
    { id: 1, to: "/", name: "Trang chủ", hasArrow: false },
    { id: 2, to: "/services", name: "Dịch vụ", hasArrow: false },
    { id: 3, to: "/doctors", name: "Bác sĩ", hasArrow: false },
    { id: 4, to: "/patient/book", name: "Đặt lịch", hasArrow: false },
    { id: 5, to: "/patient/appointments", name: "Lịch hẹn", hasArrow: false },
    { id: 6, to: "/patient/history", name: "Lịch sử", hasArrow: false },
    { id: 7, to: import.meta.env.VITE_AI_URL, name: "Trợ lý A*Care", hasArrow: false, isExternal: true },
];

// Export theo vai trò
export const headerListByRole = {
    GUEST: guestMenu,
    ADMIN: adminMenu,
    DOCTOR: doctorMenu,
    PATIENT: patientMenu,
};
