import { motion } from "framer-motion";
import doctorImg1 from "../../assets/images/doctor/doctor.png";

const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
const fadeUp = (d = 0) => ({
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: "easeOut" } }
});

function AboutSection() {

    return (
        <section className="bg-[var(--surface)] px-6 py-20 md:px-12 lg:px-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 rounded-[32px] bg-white p-8 shadow-xl lg:grid-cols-2 lg:p-12">
                {/* LEFT */}
                <motion.div
                    className="relative flex justify-center overflow-visible"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeLeft}
                >
                    <motion.div
                        className="absolute inset-0 -z-10 flex items-center justify-center"
                        variants={fadeUp(0.1)}
                    >
                        <div className="h-[520px] w-[420px] rounded-[240px] bg-cyan-50" />
                    </motion.div>

                    {/* Chấm bi bên phải */}
                    <motion.div
                        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 -z-10"
                        variants={fadeUp(0.2)}
                    >
                        <div className="grid grid-cols-6 gap-3 opacity-40">
                            {Array.from({ length: 36 }).map((_, i) => (
                                <span key={i} className="w-2 h-2 rounded-full bg-sky-200 inline-block" />
                            ))}
                        </div>
                    </motion.div>

                    <motion.img
                        src={doctorImg1}
                        alt="Bác sĩ A*Care Clinic"
                        className="relative right-[-20px] top-[20px] h-[420px] w-[420px] rounded-full border-8 border-white bg-gray-100 object-cover shadow-2xl"
                        variants={fadeLeft}
                        transition={{ duration: 0.9 }}
                        whileHover={{ scale: 1.03 }}
                    />

                    <motion.div
                        className="absolute -bottom-5 left-8 z-20 rotate-[-8deg]"
                        variants={fadeUp(0.3)}
                    >
                        <div className="rounded-2xl border-4 border-white bg-[var(--brand-navy)] px-6 py-4 text-white shadow-2xl">
                            <div className="flex items-center gap-3">
                                <svg width="28" height="28" viewBox="0 0 24 24" className="fill-white">
                                    <path d="M12 2c3.9 0 7 2.7 7 6.5 0 1.7-.6 3.4-1.6 4.7-.6.8-1.4 1.1-2.1.8-.6-.2-1.1-.9-1.3-1.6-.3-1-.5-1.5-1.2-1.5s-.9.5-1.2 1.5c-.2.7-.7 1.4-1.3 1.6-.8.3-1.6 0-2.1-.8C5.6 11.9 5 10.2 5 8.5 5 4.7 8.1 2 12 2z" />
                                </svg>
                                <div>
                                    <p className="text-base font-semibold leading-tight">15+ Years Of</p>
                                    <p className="text-lg font-bold leading-tight">Clinical Practice</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* RIGHT */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeRight}
                >
                    <motion.p className="text-sky-600 font-semibold uppercase tracking-wide mb-2" variants={fadeUp(0.0)}>
                        About A<sup>*</sup>Care Clinic
                    </motion.p>

                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-[#0b2b6b] leading-tight mb-4"
                        variants={fadeUp(0.1)}
                    >
                        Không chỉ điều trị,
                        <br /> chúng tôi xây dựng trải nghiệm chữa lành
                    </motion.h2>

                    <motion.p className="text-slate-600 mb-6" variants={fadeUp(0.2)}>
                        Chúng tôi tập trung vào chẩn đoán chính xác, kế hoạch điều trị rõ ràng và chăm sóc sau điều trị.
                        Mỗi bệnh nhân đều được tư vấn cá nhân hóa theo hồ sơ sức khỏe và mục tiêu điều trị thực tế.
                    </motion.p>

                    <motion.div className="flex gap-4 items-stretch mb-6" variants={fadeUp(0.3)}>
                        <div className="flex-1 border-l-3 rounded-lg border-sky-500 pl-4">
                            <h3 className="text-xl font-semibold text-[#0b2b6b]">
                                Lựa chọn đúng đắn cho dịch vụ y tế chất lượng
                            </h3>
                            <ul className="mt-3 space-y-2 text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center">
                                        <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                                    </span>
                                    Trang thiết bị hiện đại, quy trình điều trị chuẩn hóa
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center">
                                        <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                                    </span>
                                    Minh bạch chi phí và lộ trình tái khám rõ ràng
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center">
                                        <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                                    </span>
                                    Đội ngũ bác sĩ đồng hành sát sao trong suốt liệu trình
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.p className="text-slate-600 mb-6" variants={fadeUp(0.35)}>
                        A*Care cam kết đem lại dịch vụ y tế đáng tin cậy với chất lượng ổn định ở mọi lần thăm khám.
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}

export default AboutSection;
