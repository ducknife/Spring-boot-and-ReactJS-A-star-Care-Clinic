import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { serviceService } from "../api";
import ActionModal from "../components/ActionModal";
import { getUserRole, isLoggedIn } from "../utils/authUtils";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut",
            staggerChildren: 0.05,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionModal, setActionModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        tone: "info",
        confirmText: "Đóng",
        cancelText: "Hủy",
        showCancel: false,
        onConfirm: null,
    });
    const navigate = useNavigate();

    // State cho search
    const [searchParams, setSearchParams] = useState({
        name: '',
        minPrice: '',
        maxPrice: ''
    });

    // Lấy danh sách services
    useEffect(() => {
        const loadAll = async () => {
            try {
                const data = await serviceService.getAll();
                setServices(data);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    // Xử lý thay đổi search input
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý tìm kiếm
    const handleSearch = async () => {
        setLoading(true);
        try {
            const searchResults = await serviceService.search(searchParams);
            setServices(searchResults);
        }
        catch (err) {
            console.error("Error searching services:", err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };

    // Reset search
    const handleReset = async () => {
        setSearchParams({
            name: '',
            minPrice: '',
            maxPrice: ''
        });
        setLoading(true);
        try {
            const data = await serviceService.getAll();
            setServices(data);
        } catch (err) {
            console.error("Error fetching services:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const closeActionModal = () => {
        setActionModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
    };

    const handleBookService = (serviceId) => {
        const role = getUserRole();

        if (!isLoggedIn()) {
            setActionModal({
                isOpen: true,
                title: "Cần đăng nhập",
                message: "Bạn cần đăng nhập tài khoản bệnh nhân trước khi đặt lịch hẹn.",
                tone: "warning",
                confirmText: "Đăng nhập",
                cancelText: "Để sau",
                showCancel: true,
                onConfirm: () => navigate("/login"),
            });
            return;
        }

        if (role !== "PATIENT") {
            setActionModal({
                isOpen: true,
                title: "Không thể đặt lịch",
                message: "Chỉ tài khoản bệnh nhân mới có thể đặt lịch hẹn từ trang dịch vụ.",
                tone: "warning",
                confirmText: "Đã hiểu",
                cancelText: "Hủy",
                showCancel: false,
                onConfirm: null,
            });
            return;
        }

        navigate("/patient/book", {
            state: { preselectedServiceId: String(serviceId) },
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
            <div className="text-center p-4 text-slate-600">Đang tải dịch vụ...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
            <div className="text-center text-red-500 p-4">{error}</div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[40vh] bg-[var(--surface)] px-4 py-8 sm:px-6 sm:py-10"
        >
            {/* Header */}
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mb-8 max-w-6xl rounded-[24px] bg-[var(--brand-navy)] p-5 text-center text-3xl font-semibold slogan-h-1 shadow-2xl sm:rounded-[28px] sm:p-8 sm:text-4xl"
            >
                Danh mục dịch vụ
            </motion.h1>

            {/* Thanh tìm kiếm */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mx-auto mb-8 max-w-6xl rounded-2xl border border-cyan-100 bg-white p-4 shadow-xl sm:p-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <FiSearch className="text-[#00278D]" size={20} />
                    <h2 className="text-lg font-semibold text-[#00278D]">Tìm kiếm dịch vụ</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Tên dịch vụ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên dịch vụ
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={searchParams.name}
                            onChange={handleSearchChange}
                            placeholder="Nhập tên dịch vụ..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>

                    {/* Giá tối thiểu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá tối thiểu (₫)
                        </label>
                        <input
                            type="number"
                            name="minPrice"
                            value={searchParams.minPrice}
                            onChange={handleSearchChange}
                            placeholder="0"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>

                    {/* Giá tối đa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá tối đa (₫)
                        </label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={searchParams.maxPrice}
                            onChange={handleSearchChange}
                            placeholder="Không giới hạn"
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleSearch}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-6 py-2 font-medium text-white transition-colors hover:bg-sky-700 sm:w-auto"
                    >
                        <FiSearch size={16} />
                        Tìm kiếm
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full rounded-lg bg-slate-500 px-6 py-2 font-medium text-white transition-colors hover:bg-slate-600 sm:w-auto"
                    >
                        Đặt lại
                    </button>
                </div>
            </motion.div>

            {/* Danh sách dịch vụ */}
            {services.length > 0 ? (
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                >
                    {services.map((s) => (
                        <motion.div
                            key={s.id}
                            variants={item}
                            className="group flex flex-col justify-between rounded-2xl border border-cyan-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-8"
                        >
                            <h2 className="text-2xl font-semibold leading-snug text-[#00278D] mb-4">
                                {s.name}
                            </h2>

                            <p className="text-lg leading-snug text-slate-500 mb-4">Giá dịch vụ: {s.price.toLocaleString("vi-VN")} ₫</p>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/show-service/${s.id}`)}
                                    className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-cyan-50 text-sky-700 transition-all duration-300 hover:bg-[var(--brand-navy)] hover:text-white"
                                >
                                    Read more <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleBookService(s.id)}
                                    className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-[#00278D] text-white transition-all duration-300 hover:bg-[#001f5f]"
                                >
                                    Đặt lịch hẹn
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <p className="text-center text-slate-600 mt-6">
                    Không có dịch vụ nào
                </p>
            )}

            <ActionModal
                isOpen={actionModal.isOpen}
                title={actionModal.title}
                message={actionModal.message}
                tone={actionModal.tone}
                confirmText={actionModal.confirmText}
                cancelText={actionModal.cancelText}
                showCancel={actionModal.showCancel}
                onClose={closeActionModal}
                onConfirm={actionModal.onConfirm || closeActionModal}
            />
        </motion.div>
    );
}

export default Services;
