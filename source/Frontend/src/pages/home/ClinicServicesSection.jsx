
import { FiArrowRight, FiHeart, FiCpu } from "react-icons/fi";
import { MdOutlineMonitorHeart, MdOutlineLocalPharmacy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const clinicServices = [
    {
        icon: <MdOutlineMonitorHeart className="w-7 h-7" />,
        title: "Khám ngoại trú tổng quát",
        desc: "Tư vấn, sàng lọc toàn diện, xây dựng hồ sơ sức khỏe cá nhân.",
    },
    {
        icon: <MdOutlineMonitorHeart className="w-7 h-7" />,
        title: "Khám chuyên khoa sâu",
        desc: "Tim mạch, hô hấp, tiêu hóa, cơ xương khớp, nội tiết, thần kinh.",
    },
    {
        icon: <MdOutlineMonitorHeart className="w-7 h-7" />,
        title: "Chẩn đoán hình ảnh số",
        desc: "Siêu âm, X-quang số hóa, CT/MRI liên kết, lưu trữ PACS.",
    },
    {
        icon: <FiCpu className="w-7 h-7" />,
        title: "Ứng dụng AI hỗ trợ chẩn đoán",
        desc: "Gợi ý bất thường, đối chiếu guideline, giảm sai sót lâm sàng.",
    },
    {
        icon: <MdOutlineLocalPharmacy className="w-7 h-7" />,
        title: "Quản lý thuốc & điều trị",
        desc: "E-prescription, nhắc liều, tương tác thuốc, đồng bộ nhà thuốc.",
    },
    {
        icon: <FiHeart className="w-7 h-7" />,
        title: "Theo dõi & tái khám thông minh",
        desc: "Đặt lịch online, nhắc hẹn, theo dõi chỉ số sức khỏe từ xa.",
    },
];

function ClinicServicesSection() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <section className="w-full bg-white py-20">
            <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-10 px-6 xl:flex-row xl:gap-14">
                <motion.div 
                    className="flex-1"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <motion.p 
                        className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-500"
                        variants={itemVariants}
                    >
                        our featured treatments
                    </motion.p>
                    <motion.h2 
                        className="mb-4 text-4xl font-bold leading-tight text-[var(--brand-navy)] xl:text-5xl"
                        variants={itemVariants}
                    >
                        Dịch vụ nổi bật
                        <br />
                        được cá nhân hóa theo từng hồ sơ
                    </motion.h2>
                    <motion.p 
                        className="mb-6 max-w-xl text-slate-500"
                        variants={itemVariants}
                    >
                        Từ chăm sóc phòng ngừa, điều trị nha khoa chuyên sâu đến theo dõi định kỳ,
                        mỗi dịch vụ đều được thiết kế để tối ưu hiệu quả điều trị và thời gian của bạn.
                    </motion.p>

                    {/* Rating + button */}
                    <motion.div 
                        className="mb-8 flex flex-wrap items-center justify-between gap-4"
                        variants={itemVariants}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-sky-200 border-2 border-white" />
                                <div className="w-8 h-8 rounded-full bg-sky-300 border-2 border-white" />
                                <div className="w-8 h-8 rounded-full bg-sky-400 border-2 border-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 text-sm">
                                    {"★ ★ ★ ★ ★"}
                                </div>
                                <p className="text-xs text-slate-500">
                                    4.9/5 từ hơn 3,200 lượt đánh giá
                                </p>
                            </div>
                        </div>

                        <motion.button 
                            onClick={() => navigate("/services")} 
                            className="cursor-pointer hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 text-white text-sm font-semibold shadow-md hover:bg-sky-600 transition"
                        >
                            Xem tất cả dịch vụ
                            <FiArrowRight className="w-4 h-4" />
                        </motion.button>
                    </motion.div>

                    {/* Services grid */}
                    <motion.div 
                        className="grid md:grid-cols-2 gap-4"
                        variants={containerVariants}
                    >
                        {clinicServices.map((s, i) => (
                            <motion.div
                                key={i}
                                className="group flex flex-col gap-2 rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white px-5 py-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                                variants={cardVariants}
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white transition group-hover:bg-[var(--brand-navy)]">
                                    {s.icon}
                                </div>
                                <h3 className="font-semibold text-[#00278D] text-base">
                                    {s.title}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {s.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div 
                        className="mt-8 select-none text-[40px] font-extrabold tracking-[0.15em] text-cyan-100 md:text-[52px]"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        CARE PROGRAMS
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}

export default ClinicServicesSection;