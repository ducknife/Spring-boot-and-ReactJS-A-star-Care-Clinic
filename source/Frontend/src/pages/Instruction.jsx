import { motion } from "framer-motion";
import { FiUserPlus, FiCalendar, FiFileText, FiCheckCircle, FiUsers, FiActivity, FiSettings } from "react-icons/fi";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/authUtils";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

function Instruction() {
    const role = getUserRole() || "GUEST";

    if (role === "PATIENT") {
        return <Navigate to="/patient/book?guide=1" replace />;
    }

    const getRoleTitle = () => {
        switch(role) {
            case "PATIENT": return "Bệnh nhân";
            case "DOCTOR": return "Bác sĩ";
            case "ADMIN": return "Quản trị viên";
            default: return "Khách";
        }
    };

    const patientSteps = [
        {
            icon: <FiUserPlus size={40} />,
            title: "Bước 1: Đăng ký tài khoản",
            desc: "Truy cập trang web và đăng ký tài khoản bằng email. Điền đầy đủ thông tin cá nhân để tạo hồ sơ bệnh nhân."
        },
        {
            icon: <FiCalendar size={40} />,
            title: "Bước 2: Đặt lịch khám",
            desc: "Chọn bác sĩ, phòng khám và thời gian phù hợp. Điền triệu chứng hoặc ghi chú nếu cần. Hệ thống sẽ xác nhận lịch hẹn ngay lập tức."
        },
        {
            icon: <FiFileText size={40} />,
            title: "Bước 3: Xem lịch sử khám",
            desc: "Theo dõi lịch hẹn đã đặt, trạng thái khám bệnh. Có thể sửa hoặc hủy lịch hẹn chưa diễn ra."
        },
        {
            icon: <FiCheckCircle size={40} />,
            title: "Bước 4: Hoàn thành khám",
            desc: "Đến phòng khám đúng giờ hẹn. Sau khi khám xong, thanh toán tại quầy và nhận hóa đơn."
        }
    ];

    const doctorSteps = [
        {
            icon: <FiCalendar size={40} />,
            title: "Xem lịch khám",
            desc: "Xem tất cả lịch hẹn của bạn theo ngày, tuần, tháng. Lọc theo trạng thái để quản lý hiệu quả."
        },
        {
            icon: <FiUsers size={40} />,
            title: "Quản lý bệnh nhân",
            desc: "Xem danh sách bệnh nhân đã từng khám. Tìm kiếm và xem chi tiết thông tin bệnh nhân."
        },
        {
            icon: <FiActivity size={40} />,
            title: "Xem thống kê",
            desc: "Theo dõi số lượt khám, doanh thu theo tháng. Xem biểu đồ và báo cáo chi tiết."
        }
    ];

    const adminFeatures = [
        {
            icon: <FiUsers size={40} />,
            title: "Quản lý người dùng",
            desc: "Thêm, sửa, xóa tài khoản người dùng (bệnh nhân, bác sĩ, admin). Tìm kiếm và lọc theo vai trò."
        },
        {
            icon: <FiFileText size={40} />,
            title: "Quản lý dịch vụ",
            desc: "Thêm dịch vụ y tế mới, cập nhật giá và mô tả. Tìm kiếm theo tên dịch vụ."
        },
        {
            icon: <FiCalendar size={40} />,
            title: "Quản lý phòng & lịch hẹn",
            desc: "Quản lý phòng khám theo tầng. Xem và quản lý tất cả lịch hẹn trong hệ thống."
        },
        {
            icon: <FiActivity size={40} />,
            title: "Dashboard thống kê",
            desc: "Xem tổng quan hoạt động: số lượt khám, doanh thu theo tháng. Biểu đồ trực quan."
        }
    ];

    const guestSteps = [
        {
            icon: <FiUserPlus size={40} />,
            title: "Đăng ký tài khoản",
            desc: "Bạn cần đăng ký tài khoản để sử dụng dịch vụ đặt lịch khám. Click vào nút 'Đăng nhập' ở góc trên bên phải."
        },
        {
            icon: <FiFileText size={40} />,
            title: "Xem dịch vụ",
            desc: "Khám phá các dịch vụ y tế mà phòng khám cung cấp. Xem giá và mô tả chi tiết từng dịch vụ."
        },
        {
            icon: <FiCalendar size={40} />,
            title: "Liên hệ",
            desc: "Nếu có thắc mắc, hãy liên hệ với chúng tôi qua trang Liên hệ hoặc gọi hotline."
        }
    ];

    const renderContent = () => {
        switch(role) {
            case "PATIENT":
                return (
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                            {patientSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-lg transition-all hover:shadow-xl sm:p-8"
                                >
                                    <div className="text-sky-600 mb-4">{step.icon}</div>
                                    <h3 className="text-xl font-bold text-[#00278D] mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <a
                                href="/patient/book"
                                className="inline-block rounded-lg bg-[var(--brand-navy)] px-8 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-sky-700"
                            >
                                Đặt lịch ngay
                            </a>
                        </div>
                    </motion.section>
                );

            case "DOCTOR":
                return (
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                            {doctorSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-cyan-100 bg-white p-5 text-center shadow-lg transition-all hover:shadow-xl sm:p-8"
                                >
                                    <div className="text-sky-600 flex justify-center mb-4">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00278D] mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                );

            case "ADMIN":
                return (
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {adminFeatures.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeUp}
                                    className="rounded-xl border border-cyan-100 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
                                >
                                    <div className="text-sky-600 mb-4">{feature.icon}</div>
                                    <h3 className="text-lg font-bold text-[#00278D] mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                );

            default: // GUEST
                return (
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
                            {guestSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-cyan-100 bg-white p-5 text-center shadow-lg transition-all hover:shadow-xl sm:p-8"
                                >
                                    <div className="text-sky-600 flex justify-center mb-4">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00278D] mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <a
                                href="/login"
                                className="inline-block rounded-lg bg-[var(--brand-navy)] px-8 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-sky-700"
                            >
                                Đăng nhập ngay
                            </a>
                        </div>
                    </motion.section>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[var(--surface)] px-4 py-10 sm:px-6 sm:py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-10 max-w-6xl rounded-[24px] bg-[var(--brand-navy)] p-6 text-center text-white shadow-2xl sm:mb-14 sm:rounded-[28px] sm:p-10"
            >
                <span className="font-bold text-sm uppercase tracking-[0.18em] text-cyan-200">
                    INSTRUCTION
                </span>
                <h1 className="slogan-h-1 mt-4 mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
                    Nếu bạn là {getRoleTitle()}
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-cyan-50/90">
                    {role === "GUEST" 
                        ? "Hướng dẫn sử dụng hệ thống dành cho bạn"
                        : `Hướng dẫn chi tiết các tính năng và cách sử dụng hệ thống dành cho ${getRoleTitle()}`
                    }
                </p>
            </motion.div>

            {/* Dynamic Content Based on Role */}
            {renderContent()}

            {/* Note Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto mt-12 max-w-4xl rounded-2xl border border-cyan-100 bg-white p-5 shadow-lg sm:mt-16 sm:p-8"
            >
                <h3 className="mb-4 text-xl font-bold text-[#00278D] sm:text-2xl">
                    Lưu ý quan trọng
                </h3>
                <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-2">
                        <FiCheckCircle className="text-sky-600 mt-1 flex-shrink-0" />
                        <span>Đặt lịch trước ít nhất 1 ngày để đảm bảo có chỗ</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FiCheckCircle className="text-sky-600 mt-1 flex-shrink-0" />
                        <span>Hủy lịch trước ít nhất 2 giờ nếu không thể đến khám</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FiCheckCircle className="text-sky-600 mt-1 flex-shrink-0" />
                        <span>Cung cấp thông tin chính xác khi đăng ký để tránh nhầm lẫn</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <FiCheckCircle className="text-sky-600 mt-1 flex-shrink-0" />
                        <span>Bảo mật mật khẩu và không chia sẻ tài khoản với người khác</span>
                    </li>
                </ul>
            </motion.section>
        </div>
    );
}

export default Instruction;
