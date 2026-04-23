import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import { userService } from "../api";

const DOCTORS_PER_PAGE = 8;

const normalizeDoctors = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const normalizeTotalPages = (payload, fallbackLength) => {
    if (Number.isFinite(payload?.totalPages)) {
        return Math.max(1, payload.totalPages);
    }
    return Math.max(1, Math.ceil(fallbackLength / DOCTORS_PER_PAGE));
};

function Doctors() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pagedDoctors = useMemo(() => doctors, [doctors]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                setLoading(true);
                setError("");

                const payload = await userService.getDoctors({
                    page: Math.max(0, currentPage - 1),
                    size: DOCTORS_PER_PAGE,
                    sort: "fullName,asc",
                });

                const content = normalizeDoctors(payload);
                setDoctors(content);
                setTotalPages(normalizeTotalPages(payload, content.length));
            } catch (err) {
                setError(err?.message || "Không thể tải danh sách bác sĩ");
            } finally {
                setLoading(false);
            }
        };

        loadDoctors();
    }, [currentPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--surface)] px-6 py-14 text-center text-slate-600">
                Đang tải danh sách bác sĩ...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--surface)] px-6 py-14 text-center text-rose-600">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--surface)] px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--brand-navy)] sm:text-3xl">Danh sách bác sĩ</h1>
                        <p className="mt-2 text-slate-600">
                            Xem thông tin chuyên môn và kinh nghiệm của đội ngũ bác sĩ tại A*Care.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        Về trang chủ
                    </button>
                </div>

                {doctors.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                        Hiện chưa có bác sĩ nào.
                    </div>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {pagedDoctors.map((doctor) => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))}
                        </motion.div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FiChevronLeft className="h-4 w-4" />
                                Trước
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition-colors ${
                                        page === currentPage
                                            ? "bg-[var(--brand-600)] text-white"
                                            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Sau
                                <FiChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Doctors;
