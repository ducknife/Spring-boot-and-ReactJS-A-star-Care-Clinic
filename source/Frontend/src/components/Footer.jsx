import { RiTwitterXLine, RiArrowRightLine, RiArrowUpSLine } from "react-icons/ri";
import { FaFacebookF, FaInstagram, FaPinterestP } from "react-icons/fa";
import { services, information } from "../data/footerList";
import logo_plus from "../assets/images/logo/clinic.png";
import Chatbot from "./Chatbot";

function GoTopButton() {
    return (
        <button
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="
                fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full
                bg-sky-600 hover:bg-sky-500 text-white
                shadow-lg shadow-sky-900/30
                flex items-center justify-center
                transition-colors
            "
        >
            <RiArrowUpSLine className="text-2xl" />
        </button>
    );
}

function Footer() {
    return (
        <footer className="relative text-slate-200">
            <div className="bg-gradient-to-br from-[#031638] via-[#051f4e] to-[#072f63]">
                <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                <img src={logo_plus} alt="logo" className="rounded-full" />
                            </div>
                            <div className="text-2xl font-semibold">
                                <span className="text-white">A<sup>*</sup></span>
                                <span className="text-sky-500">Care</span>
                            </div>
                        </div>
                        <p className="mt-6 leading-relaxed text-slate-300/90">
                            Nhanh chóng, chính xác và tận tâm trong từng trải nghiệm khám chữa bệnh.
                        </p>

                        <a href="tel:0379330721" className="mt-6 block text-blue-900 text-lg font-semibold hover:underline">
                            037 933 0721
                        </a>
                        <a href="mailto:info@gmail.com" className="mt-1 block hover:underline">
                            darkisknight126@gmail.com
                        </a>
                        <div className="mt-6 flex items-center gap-4 text-xl">
                            <a href="#" className="hover:text-blue-900 transition-colors" aria-label="Facebook">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="hover:text-blue-900 transition-colors" aria-label="X">
                                <RiTwitterXLine />
                            </a>
                            <a href="#" className="hover:text-blue-900 transition-colors" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="hover:text-blue-900 transition-colors" aria-label="Pinterest">
                                <FaPinterestP />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-bold tracking-wide">DỊCH VỤ</h4>
                        <div className="h-1 w-12 bg-sky-500 rounded mt-3" />
                        <ul className="mt-5 space-y-3">
                            {services.map((s) => (
                                <li key={s} className="text-slate-300 hover:text-white transition-colors cursor-pointer">
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-bold tracking-wide">THÔNG TIN</h4>
                        <div className="h-1 w-12 bg-sky-500 rounded mt-3" />
                        <ul className="mt-5 space-y-3">
                            {information.map((s) => (
                                <li key={s} className="text-slate-300 hover:text-white transition-colors">
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-bold tracking-wide">ĐĂNG KÝ NHẬN TIN</h4>
                        <div className="h-1 w-12 bg-sky-500 rounded mt-3" />
                        <p className="mt-5 text-slate-300">
                            Đăng ký để nhận ưu đãi 10% ngay hôm nay!
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            className="mt-5"
                        >
                            <div className="flex items-center">
                                <input
                                    type="email"
                                    placeholder="Địa chỉ Email"
                                    className="
                                        w-full rounded-full bg-white text-slate-800 placeholder-slate-400
                                        px-5 py-3 outline-none
                                        border border-white/20 focus:border-sky-500
                                    "
                                    required
                                />
                                <button
                                    type="submit"
                                    className="
                                        -ml-px rounded-full bg-sky-600 hover:bg-sky-500
                                        px-5 py-3 text-white transition-colors
                                        flex items-center cursor-pointer
                                    "
                                    aria-label="Subscribe"
                                >
                                    <RiArrowRightLine className="text-2xl transition duration-500 ease-in-out" />
                                </button>
                            </div>
                        </form>

                        <p className="mt-5 text-slate-300/80 leading-relaxed">
                            Đăng ký để nhận thông tin, ưu đãi và tin tức mới nhất từ phòng khám của chúng tôi
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-[#011342]">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-4 md:flex-row">
                    <p className="text-slate-300/90">© Copyright 2025 A<sup>*</sup> SQUAD, All rights reserved ®</p>
                </div>
            </div>
            <GoTopButton />
            <Chatbot />
        </footer>
    );
}

export default Footer;