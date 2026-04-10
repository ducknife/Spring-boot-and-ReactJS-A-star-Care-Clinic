import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/authUtils";
import team from "../../assets/images/doctor/teams.jpg";
import { FiCalendar, FiShield, FiClock } from "react-icons/fi";

export default function HeroSection() {

    const navigate = useNavigate();
    const role = getUserRole() || "GUEST";
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#02163f] via-[#06245f] to-[#0d4e8c] px-6 py-16 md:px-14 xl:px-24">
            <div className="absolute -left-28 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-sky-200/20 blur-3xl" />

            <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
            <motion.div
                className="space-y-7"
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <p className="inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                    Dental & General Clinic
                </p>

                <motion.h1
                    className="text-4xl font-bold leading-tight text-white md:text-5xl xl:text-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Nha khoa thẩm mỹ và
                    <span className="ml-2 inline-block rounded-2xl bg-white px-3 py-1 text-[var(--brand-navy)]">
                        điều trị toàn diện
                    </span>
                </motion.h1>

                <motion.p
                    className="max-w-xl leading-relaxed text-sky-50/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    A*Care Clinic mang đến trải nghiệm điều trị nhẹ nhàng, minh bạch kế hoạch chăm sóc và theo dõi lâu dài.
                    Đội ngũ bác sĩ chuyên môn cao cùng hệ thống chẩn đoán hiện đại giúp bạn an tâm trong từng lần thăm khám.
                </motion.p>

                <motion.div
                    className="grid gap-3 text-sm text-cyan-50 sm:grid-cols-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-3">
                        <FiShield />
                        Tiêu chuẩn vô trùng cao
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-3">
                        <FiClock />
                        Đặt lịch nhanh trong 60s
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 p-3">
                        <FiCalendar />
                        Nhắc lịch tái khám tự động
                    </div>
                </motion.div>

                {role == "PATIENT" || role == "GUEST" ? <motion.div
                    className="mt-2 flex flex-wrap gap-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                >
                    <button
                        onClick={() => navigate("/patient/book")}
                        className="rounded-xl bg-white px-6 py-3 font-semibold text-[var(--brand-navy)] shadow-md transition hover:bg-slate-100"
                    >
                        Đặt lịch hẹn ngay
                    </button>
                    <button
                        onClick={() => navigate("/services")}
                        className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                    >
                        Xem dịch vụ nổi bật
                    </button>
                </motion.div> : ""}
            </motion.div>

            <motion.div
                className="relative"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <img
                    src={team}
                    alt="Đội ngũ bác sĩ A*Care Clinic"
                    className="h-[520px] w-full rounded-[32px] object-cover shadow-2xl ring-1 ring-white/30"
                />

                <div className="absolute -bottom-6 left-6 rounded-2xl bg-white p-4 shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">Rated Care</p>
                    <p className="mt-1 text-lg font-bold text-[var(--brand-navy)]">4.9/5 từ 3.2k khách hàng</p>
                </div>
            </motion.div>
            </div>
        </section>
    );
}
