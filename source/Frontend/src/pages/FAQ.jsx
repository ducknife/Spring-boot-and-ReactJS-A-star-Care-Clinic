import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";
import { faqs } from "../data/faq";

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    

    const toggleFAQ = (categoryIdx, questionIdx) => {
        const index = `${categoryIdx}-${questionIdx}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-[var(--surface)] py-16 px-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-14 max-w-5xl rounded-[28px] bg-gradient-to-br from-[#03163d] via-[#06245f] to-[#0e4a82] p-10 text-center text-white shadow-2xl"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="inline-block mb-6"
                >
                    <FiHelpCircle className="mx-auto text-7xl text-cyan-200" />
                </motion.div>
                <h1 className="mt-4 mb-6 text-4xl font-bold md:text-5xl">
                    Câu hỏi thường gặp
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-cyan-50/90">
                    Tìm câu trả lời cho các thắc mắc phổ biến về dịch vụ, tính năng và cách sử dụng hệ thống A<sup>*</sup>Care Clinic
                </p>
            </motion.div>

            {/* FAQ Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {faqs.map((category, catIdx) => (
                        <motion.section
                            key={catIdx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: catIdx * 0.1 }}
                            className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-lg transition-all hover:shadow-xl"
                        >
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${category.color}`} />
                                <h2 className="text-2xl font-bold text-[#00278D]">
                                    {category.category}
                                </h2>
                            </div>

                            {/* Questions */}
                            <div className="space-y-3">
                                {category.questions.map((faq, qIdx) => {
                                    const index = `${catIdx}-${qIdx}`;
                                    const isOpen = openIndex === index;

                                    return (
                                        <div
                                            key={qIdx}
                                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100"
                                        >
                                            <button
                                                onClick={() => toggleFAQ(catIdx, qIdx)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-sky-50 transition-colors"
                                            >
                                                <span className="font-semibold text-[#00278D] pr-4 text-sm">
                                                    {faq.q}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="flex-shrink-0"
                                                >
                                                    <FiChevronDown className="text-sky-600 text-xl" />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="px-4 pb-4 text-slate-600 leading-relaxed text-sm border-t border-sky-100 pt-3">
                                                            {faq.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>

            {/* Contact CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mx-auto mt-16 max-w-3xl rounded-2xl bg-[var(--brand-navy)] p-10 text-center text-white shadow-2xl"
            >
                <h3 className="text-3xl font-bold mb-4">
                    Không tìm thấy câu trả lời?
                </h3>
                <p className="text-white/90 mb-6 text-lg">
                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
                </p>
                <a
                    href="/contact"
                    className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-[var(--brand-navy)] shadow-lg transition-colors hover:bg-sky-50 hover:shadow-xl"
                >
                    Liên hệ với chúng tôi
                </a>
            </motion.div>
        </div>
    );
}

export default FAQ;
