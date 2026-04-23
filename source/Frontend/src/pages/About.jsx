import { motion } from "framer-motion";
import { FiAward, FiUsers, FiHeart, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

function About() {
    const navigate = useNavigate();

    const achievements = [
        { icon: <FiAward size={40} />, title: "25 năm", desc: "Kinh nghiệm" },
        { icon: <FiUsers size={40} />, title: "50+", desc: "Bác sĩ giàu kinh nghiệm" },
        { icon: <FiHeart size={40} />, title: "100,000+", desc: "Bệnh nhân tin tưởng" },
    ];

    const values = [
        { title: "Chuyên nghiệp", desc: "Đội ngũ bác sĩ được đào tạo bài bản, chuyên môn cao" },
        { title: "Tận tâm", desc: "Luôn đặt lợi ích bệnh nhân lên hàng đầu" },
        { title: "Hiện đại", desc: "Trang thiết bị y tế tiên tiến, công nghệ số hóa" },
        { title: "An toàn", desc: "Quy trình chuẩn quốc tế, vệ sinh nghiêm ngặt" },
    ];

    return (
        <div className="min-h-screen bg-[var(--surface)]">
            <div className="mx-auto max-w-6xl px-6 py-16">
                {/* Hero Section - No separate background */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    className="mb-14 rounded-[32px] border border-cyan-100 bg-[var(--brand-navy)] p-10 text-center text-white shadow-2xl"
                >
                    <span className="font-bold text-sm uppercase tracking-[0.18em] text-cyan-200">
                        ABOUT US
                    </span>
                    <h1 className="slogan-h-1 mt-4 mb-6 text-3xl font-bold md:text-5xl">
                        Sức khỏe của bạn là ưu tiên hàng đầu
                    </h1>
                    <p className="mx-auto max-w-3xl text-lg leading-relaxed text-cyan-50/90">
                        Phòng khám của chúng tôi được thành lập với mục tiêu mang đến nụ cười tươi đẹp, 
                        sức khỏe dồi dào cho mọi người. Chúng tôi cung cấp đa dạng các dịch vụ y tế chất lượng cao.
                    </p>
                </motion.div>

                {/* Modern Badge */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-14 flex justify-center"
                >
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-[#00278D] flex items-center justify-center shadow-2xl">
                            <div className="text-center">
                                <FiHeart className="text-white text-4xl mx-auto mb-2" />
                                <p className="text-white text-xs font-bold uppercase tracking-wider">
                                    Modern
                                </p>
                                <p className="text-white text-xs font-bold uppercase tracking-wider">
                                    Clinic
                                </p>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-[#00278D]"></div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-white border-2 border-[#00278D]"></div>
                    </div>
                </motion.div>

                {/* Feature List with Checkmarks - No background separation */}
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mb-14 space-y-5 rounded-[28px] border border-cyan-100 bg-white p-8 shadow-xl"
                >
                    <motion.div 
                        variants={fadeUp}
                        className="flex items-start gap-4"
                    >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center mt-1">
                            <FiCheckCircle className="text-white text-sm" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#00278D] text-xl mb-1">
                                Giải pháp tiên tiến cho sức khỏe toàn diện
                            </h3>
                            <p className="text-slate-600">
                                Ứng dụng công nghệ hiện đại và phương pháp điều trị tiên tiến
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={fadeUp}
                        className="flex items-start gap-4"
                    >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center mt-1">
                            <FiCheckCircle className="text-white text-sm" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#00278D] text-xl mb-1">
                                Phòng khám cung cấp dịch vụ toàn diện
                            </h3>
                            <p className="text-slate-600">
                                Đa dạng chuyên khoa với đội ngũ bác sĩ giàu kinh nghiệm
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={fadeUp}
                        className="flex items-start gap-4"
                    >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center mt-1">
                            <FiCheckCircle className="text-white text-sm" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#00278D] text-xl mb-1">
                                Đánh giá chi tiết và tư vấn chuyên sâu
                            </h3>
                            <p className="text-slate-600">
                                Quy trình khám bệnh chuẩn quốc tế, chăm sóc tận tâm
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mb-14 text-center text-lg leading-relaxed text-slate-600"
                >
                    Hãy để nụ cười của bạn trở nên rạng rỡ, sức khỏe dồi dào với dịch vụ y tế 
                    chất lượng cao và đội ngũ chuyên gia tận tâm của chúng tôi.
                </motion.p>

                {/* Achievement Stats - Integrated seamlessly */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                    {achievements.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            className="rounded-2xl border border-cyan-100 bg-white p-8 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="text-sky-600 flex justify-center mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-[#00278D] mb-2">{item.title}</h3>
                            <p className="text-slate-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Core Values - Seamless integration */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <h2 className="text-3xl font-bold text-[#00278D] text-center mb-10">
                        Giá trị cốt lõi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeUp}
                                className="rounded-xl border border-cyan-100 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                            >
                                <FiCheckCircle className="text-sky-600 text-3xl mb-3" />
                                <h3 className="text-lg font-bold text-[#00278D] mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-slate-600 text-sm">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Team Section - Seamless */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[28px] border border-cyan-100 bg-white p-10 text-center shadow-xl"
                >
                    <h2 className="text-3xl font-bold text-[#00278D] mb-4">
                        Đội ngũ chuyên môn
                    </h2>
                    <p className="text-slate-600 max-w-3xl mx-auto mb-8">
                        Với hơn 50 bác sĩ và nhân viên y tế giàu kinh nghiệm, được đào tạo chuyên sâu 
                        trong và ngoài nước, chúng tôi tự tin mang đến dịch vụ chăm sóc sức khỏe tốt nhất.
                    </p>
                    <button 
                        onClick={() => navigate("/services")}
                        className="rounded-xl bg-[var(--brand-navy)] px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-sky-600"
                    >
                        Xem dịch vụ của chúng tôi
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default About;
