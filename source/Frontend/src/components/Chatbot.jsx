import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSend, FiUser, FiEdit3, FiCheck } from "react-icons/fi";
import { getUserRole } from "../utils/authUtils";
import logo from "../assets/images/logo/clinic.png";
import { geminiService } from "../api/services";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Xin chào! Tôi là trợ lý ảo của A*Care Clinic. Tôi có thể giúp bạn về thông tin phòng khám, dịch vụ, đặt lịch khám và các câu hỏi thường gặp. Bạn cần hỗ trợ gì?"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await geminiService.ask(input);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: response?.answer,
                userQuestion: userMessage
            }]);
        }
        catch (error) {
            console.error("Chat error:", error);
            let errorMessage = "Xin lỗi, tôi đang gặp sự cố kỹ thuật. ";

            if (error.message.includes("API error: 400")) {
                errorMessage += "Có vấn đề với yêu cầu. Vui lòng thử lại với câu hỏi khác.";
            }
            else if (error.message.includes("API error: 401") || error.message.includes("API error: 403")) {
                errorMessage += "API key không hợp lệ. Vui lòng kiểm tra cấu hình.";
            }
            else if (error.message.includes("API error: 429")) {
                errorMessage = "Chatbot đang bảo trì. Vui lòng:\n\n" +
                    "• Thử lại sau 1-2 phút\n" +
                    "• Hoặc liên hệ trực tiếp:\n" +
                    "  Email: darkisknight126@gmail.com\n" +
                    "  Hotline: 037 933 0721";
            }
            else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                errorMessage += "Không thể kết nối đến server. Vui lòng kiểm tra internet.";
            }
            else {
                errorMessage += "Vui lòng thử lại sau hoặc liên hệ: hung.clinic@ptit.edu.vn";
            }

            setMessages(prev => [...prev, {
                role: "assistant",
                content: errorMessage
            }]);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Hint Message Bubble */}
            <AnimatePresence>
                {showHint && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-40 right-6 z-40"
                    >
                        <div className="bg-[#00278D] rounded-2xl shadow-2xl p-4 max-w-xs flex items-start gap-3 relative mb-3">
                            <div className="flex-1">
                                <p className="text-sm text-white font-medium">
                                    Bạn cần hỗ trợ gì không ạ?
                                </p>
                            </div>
                            <button
                                onClick={() => setShowHint(false)}
                                className="flex-shrink-0 text-white hover:text-slate-600 transition-colors"
                                aria-label="Close hint"
                            >
                                <FiX className="text-lg" />
                            </button>
                            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-[#00278D] rotate-45 shadow-lg"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chatbot Button - Above the scroll-to-top button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-[#00278D] hover:from-[#003bb5] hover:to-sky-400 text-white shadow-xl shadow-blue-900/30 flex items-center justify-center transition-all duration-300 p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open chatbot"
            >
                {isOpen ? (
                    <FiX className="text-2xl" />
                ) : (
                    <img src={logo} alt="chatbot" className="w-full h-full rounded-full" />
                )}
            </motion.button>

            {/* Chatbot Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-40 right-6 z-40 w-96 h-[500px] bg-white rounded-4xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#00278D] text-white p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center p-1">
                                <img src={logo} alt="clinic logo" className="w-full h-full object-contain rounded-full" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">A<sup>*</sup>ssistant</h3>
                                <p className="text-xs text-white/80 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Trợ lý ảo hỗ trợ 24/7
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-sky-500" : "bg-gradient-to-br from-[#00278D] to-sky-500"}`}>
                                            {msg.role === "user" ? (
                                                <FiUser className="text-white text-sm" />
                                            ) : (
                                                <img src={logo} alt="bot" className="w-6 h-6 object-contain rounded-full" />
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {/* Message bubble */}
                                            <div className={`rounded-2xl px-4 py-2 ${msg.role === "user" ? "bg-sky-500 text-white" : "bg-white text-slate-800 shadow-sm"}`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex gap-2 items-end">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00278D] to-sky-500 flex items-center justify-center">
                                            <img src={logo} alt="bot" className="w-6 h-6 object-contain rounded-full" />
                                        </div>
                                        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    className="flex-1 text-[#00278D] px-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00278D] to-sky-500 hover:from-[#003bb5] hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all"
                                >
                                    <FiSend className="text-lg" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Chatbot;
