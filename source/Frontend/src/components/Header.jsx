import { FiShoppingCart } from "react-icons/fi";
import { BsFillCartCheckFill } from "react-icons/bs";
import { TbPhone } from "react-icons/tb";
import { RiMenuFill } from "react-icons/ri";
import { headerListByRole } from "../data/headerList";
import { useSidebarContext } from "../contexts/SideBarContext";
import logo from "../assets/images/logo/logo_png.png";
import { NavLink, useNavigate } from "react-router-dom";
import { getUserId, getUserRole } from "../utils/authUtils";
import { useEffect, useState } from "react";
import { appointmentService } from "../api/services";

function Header() {
    const { toggleSidebar } = useSidebarContext();

    const navigate = useNavigate();
    /* lấy role để load menu */
    const role = getUserRole() || "GUEST";
    const headerList = headerListByRole[role];
    const [isFill, setIsFill] = useState(false);

    /* kiểm tra xem giỏ hàng có trống không, nếu có icon rỗng, ngược lại là icon fill */
    useEffect(() => {
        const getPendingAppointments = async () => {
            try {
                const patientId = getUserId();
                if (patientId != null) {
                    const pendingAppointments = await appointmentService.pendingByPatientId(patientId);
                    pendingAppointments.length >= 1 ? setIsFill(true) : setIsFill(false);
                }
            }
            catch (err) {
                console.log(err.message);
            }
        }
        getPendingAppointments();
    }, []);


    return (
        <header className="sticky top-0 z-20 border-b border-cyan-100 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
            <img src={logo} alt="logo" className="logo h-28 w-44 bg-cover cursor-pointer object-contain" onClick={() => navigate("/")} />
            <div className="header-menu hidden flex-wrap gap-x-8 text-[#00278D] md:flex">
                {headerList.map((item) => (
                    <div key={item.id} className="header-items relative group">
                        <NavLink to={item.to} className={({ isActive }) => `${isActive ? 'text-sky-500' : ''} font-extrabold flex items-center gap-1 hover:text-sky-500 transition-colors font-bold`}>
                            {item.name}
                            {item.hasArrow && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                    className="w-3.5 h-3.5 mt-[1px]">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            )}
                        </NavLink>

                        {/* dropdown cấp 1 */}
                        {item.children && (
                            <div
                                className="
                                    invisible opacity-0 translate-y-2 scale-95
                                    group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                                    absolute left-1/2 -translate-x-1/2 mt-2 min-w-[220px]
                                    rounded-xl bg-white shadow-xl transition-all duration-200 ease-out z-40
 
                                "
                                role="menu"
                            >
                                <div className="absolute -top-2 left-0 right-0 h-2" />
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-slate-200" />
                                <ul className="py-2">
                                    {item.children.map((c) => (
                                        <li key={c.id} className="relative group/item">
                                            <NavLink
                                                to={c.to}
                                                className={({ isActive }) => `${isActive ? 'text-sky-500' : ''} font-extrabold flex items-center justify-between gap-3 px-4 py-2.5 text-[15px] text-[#00278D] transition-colors 
                                                hover:text-sky-500 hover:bg-slate-100`}
                                                role="menuitem"
                                            >
                                                {c.label}
                                                {c.children && (
                                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#00278D] pointer-events-none"
                                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M9 6l6 6-6 6" />
                                                    </svg>
                                                )}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="other-header-items flex items-center gap-x-4 text-sky-500">
                {role == "PATIENT" ? (<div className="hidden cursor-pointer text-xl md:block"><NavLink to={"/patient/cart"}>{!isFill ? <FiShoppingCart /> : <BsFillCartCheckFill />}</NavLink></div>) : ""}
                <div className="phone gap-x-2 hidden md:flex">
                    <div className="text-xl w-11 h-11 flex justify-center items-center rounded-full p-3 border border-cyan-200 bg-cyan-50 text-sky-500">
                        <TbPhone />
                    </div>
                    <div className="flex flex-col pr-2">
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Emergency Line</p>
                        <a href="tel:0379330721" className="text-lg font-bold text-[#00278D] cursor-pointer">+84-379-330-721</a>
                    </div>
                </div>
                <button onClick={toggleSidebar} className="text-2xl border border-gray-300 rounded-sm p-2 cursor-pointer hover:border-sky-500 transition duration-500 ease-in-out">
                    <RiMenuFill />
                </button>
            </div>
            </div>
        </header>
    );
}

export default Header;
