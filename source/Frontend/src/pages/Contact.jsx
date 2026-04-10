import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheckCircle } from "react-icons/fi";
import emailjs from '@emailjs/browser';

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

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Thay thế 3 giá trị này sau khi đăng ký EmailJS
    const EMAILJS_SERVICE_ID = "service_esk90tg"; 
    const EMAILJS_TEMPLATE_ID = "template_3ko6f39";
    const EMAILJS_PUBLIC_KEY = "ruM4IPsGPOVwT1-dx";

    const contactInfo = [
        {
            icon: <FiMapPin size={28} />,
            title: "Địa chỉ",
            content: "96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội",
            color: "bg-sky-500"
        },
        {
            icon: <FiPhone size={28} />,
            title: "Điện thoại",
            content: "0379-330-721",
            color: "bg-green-500"
        },
        {
            icon: <FiMail size={28} />,
            title: "Email",
            content: "darkisknight126@gmail.com",
            color: "bg-purple-500"
        },
        {
            icon: <FiClock size={28} />,
            title: "Giờ làm việc",
            content: "T2-T6: 7:00-19:00 | T7: 7:00-17:00 | CN: 8:00-12:00",
            color: "bg-orange-500"
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        // Chuẩn bị dữ liệu email
        const payload = {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone || "Không cung cấp",
            subject: formData.subject,
            message: formData.message
        };

        // Gửi email qua EmailJS
        emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            payload,
            EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            setIsSubmitted(true);
            setIsLoading(false);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: ""
                });
            }, 3000);
        })
        .catch((error) => {
            console.error("Lỗi gửi email:", error);
            setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
            setIsLoading(false);
        });
    };

    return (
        <div className="min-h-screen bg-[var(--surface)]">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    className="mb-14 rounded-[28px] bg-gradient-to-br from-[#03163d] via-[#06245f] to-[#0e4a82] p-10 text-center text-white shadow-2xl"
                >
                    <span className="font-bold text-sm uppercase tracking-[0.18em] text-cyan-200">
                        GET IN TOUCH
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        Liên hệ với chúng tôi
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-cyan-50/90">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin hoặc liên hệ trực tiếp.
                    </p>
                </motion.div>

                {/* Contact Info Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {contactInfo.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={fadeUp}
                            className="rounded-2xl border border-cyan-100 bg-white p-6 text-center shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-[#00278D] mb-2">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {item.content}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Contact Form & Map Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-[#00278D] mb-6">
                            Gửi tin nhắn cho chúng tôi
                        </h2>
                        
                        {isSubmitted ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex flex-col items-center justify-center py-12"
                            >
                                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
                                    <FiCheckCircle className="text-white text-4xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#00278D] mb-2">
                                    Gửi thành công!
                                </h3>
                                <p className="text-slate-600 text-center">
                                    Email đã được gửi đến darkisknight126@gmail.com. Chúng tôi sẽ phản hồi sớm nhất.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-[#00278D] mb-2">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#00278D] mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#00278D] mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                            placeholder="0900-000-000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#00278D] mb-2">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                        placeholder="Chủ đề tin nhắn"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#00278D] mb-2">
                                        Nội dung <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-none"
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-sky-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <FiSend />
                                            Gửi tin nhắn
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* Map & Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Map */}
                        <div className="h-[400px] overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.292401303918!2d105.78484157503009!3d20.980912980656463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd0921797%3A0xe2ed991c5990d2b1!2zOTZBIMSQLiBUcuG6p24gUGjDuiwgUC4gTeG7mSBMYW8sIEjDoCDEkMO0bmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2sus!4v1763947011415!5m2!1svi!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="A*Care Clinic Location"
                            />
                        </div>

                        {/* Why Contact Us */}
                        <div className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-lg">
                            <h3 className="text-xl font-bold text-[#00278D] mb-4">
                                Tại sao nên liên hệ với chúng tôi?
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FiCheckCircle className="text-sky-600 text-xl flex-shrink-0 mt-1" />
                                    <p className="text-slate-600">
                                        <span className="font-semibold text-[#00278D]">Phản hồi nhanh chóng:</span> Đội ngũ hỗ trợ phản hồi trong vòng 24h
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FiCheckCircle className="text-sky-600 text-xl flex-shrink-0 mt-1" />
                                    <p className="text-slate-600">
                                        <span className="font-semibold text-[#00278D]">Tư vấn chuyên nghiệp:</span> Hỗ trợ từ chuyên gia y tế có kinh nghiệm
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FiCheckCircle className="text-sky-600 text-xl flex-shrink-0 mt-1" />
                                    <p className="text-slate-600">
                                        <span className="font-semibold text-[#00278D]">Hỗ trợ 24/7:</span> Luôn sẵn sàng giải đáp mọi thắc mắc của bạn
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FiCheckCircle className="text-sky-600 text-xl flex-shrink-0 mt-1" />
                                    <p className="text-slate-600">
                                        <span className="font-semibold text-[#00278D]">Đặt lịch dễ dàng:</span> Hướng dẫn chi tiết quy trình đặt lịch khám
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

export default Contact;
