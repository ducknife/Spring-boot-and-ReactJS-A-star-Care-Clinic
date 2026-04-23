import { useEffect, useRef, useState } from "react";
import { FiBell, FiTrash2, FiX, FiMenu, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { RiMenuFill } from "react-icons/ri";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { activityService, appointmentService, authService } from "../api";
import { APPOINTMENT_CHANGED_EVENT } from "../api/services/appointmentService";
import logo from "../assets/images/logo/logo_png.png";
import { useSidebarContext } from "../contexts/SideBarContext";
import { headerListByRole } from "../data/headerList";
import useAuthSnapshot from "../hooks/useAuthSnapshot";
import { clearCurrentUser, getRoleLabel, getRoleProfilePath } from "../utils/authUtils";

function Header() {
    const { toggleSidebar } = useSidebarContext();
    const { role: currentRole, userId, isLoggedIn } = useAuthSnapshot();
    const location = useLocation();

    const navigate = useNavigate();
    const role = currentRole || "GUEST";
    const headerList = headerListByRole[role] || headerListByRole.GUEST;
    const [isFill, setIsFill] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isBellOpen, setIsBellOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [deletingNotificationId, setDeletingNotificationId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const containerRef = useRef(null);
    const bellPanelRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const isNotificationEnabledRole = isLoggedIn && (role === "DOCTOR" || role === "PATIENT" || role === "ADMIN") && !!userId;
    const notificationTitle = role === "DOCTOR"
        ? "Thông báo bác sĩ"
        : role === "ADMIN"
            ? "Nhật ký hệ thống"
            : "Thông báo bệnh nhân";

    const normalizeNoticeMessage = (raw) => String(raw || "").replace(/^\[USER:\d+\]\s*/, "");

    const formatNoticeTime = (time) => {
        if (!time) return "";
        const value = new Date(time);
        if (Number.isNaN(value.getTime())) return "";
        const dd = String(value.getDate()).padStart(2, "0");
        const mm = String(value.getMonth() + 1).padStart(2, "0");
        const yyyy = value.getFullYear();
        const hh = String(value.getHours()).padStart(2, "0");
        const min = String(value.getMinutes()).padStart(2, "0");
        return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    };

    // Kiểm tra xem item dropdown cha có child nào đang active không
    const isDropdownParentActive = (item) => {
        if (!item.children) return false;
        return item.children.some((child) => location.pathname === child.to || location.pathname.startsWith(child.to + "/"));
    };

    useEffect(() => {
        const handleAppointmentChanged = () => {
            setRefreshKey((prev) => prev + 1);
        };
        window.addEventListener(APPOINTMENT_CHANGED_EVENT, handleAppointmentChanged);
        return () => window.removeEventListener(APPOINTMENT_CHANGED_EVENT, handleAppointmentChanged);
    }, []);

    useEffect(() => {
        if (role !== "PATIENT" || !userId) {
            setIsFill(false);
            return;
        }
        const getPendingAppointments = async () => {
            try {
                const pendingAppointments = await appointmentService.pendingByPatientId(userId);
                setIsFill(pendingAppointments.length >= 1);
            } catch {
                setIsFill(false);
            }
        };
        getPendingAppointments();
    }, [role, userId, refreshKey]);

    useEffect(() => {
        if (!isNotificationEnabledRole) {
            setNotifications([]);
            setNotificationCount(0);
            setSelectedNotification(null);
            setIsBellOpen(false);
            return;
        }

        let isMounted = true;

        const loadNotifications = async () => {
            try {
                if (role === "ADMIN") {
                    const list = await activityService.getRecentAdmin();
                    if (!isMounted) return;
                    const normalizedList = Array.isArray(list) ? list : [];
                    setNotifications(normalizedList);
                    setNotificationCount(normalizedList.length);
                    if (normalizedList.length === 0) { setSelectedNotification(null); return; }
                    setSelectedNotification((prev) => {
                        if (!prev) return normalizedList[0];
                        return normalizedList.find((item) => item.id === prev.id) || normalizedList[0];
                    });
                    return;
                }
                const [list, count] = await Promise.all([
                    activityService.getRecentByUser(userId),
                    activityService.getCountByUser(userId),
                ]);
                if (!isMounted) return;
                const normalizedList = Array.isArray(list) ? list : [];
                setNotifications(normalizedList);
                setNotificationCount(Number(count) || normalizedList.length);
                if (normalizedList.length === 0) { setSelectedNotification(null); return; }
                setSelectedNotification((prev) => {
                    if (!prev) return normalizedList[0];
                    return normalizedList.find((item) => item.id === prev.id) || normalizedList[0];
                });
            } catch {
                if (!isMounted) return;
                setNotifications([]);
                setNotificationCount(0);
                setSelectedNotification(null);
            }
        };

        loadNotifications();
        const timer = setInterval(loadNotifications, 15000);
        return () => { isMounted = false; clearInterval(timer); };
    }, [isNotificationEnabledRole, userId, role, refreshKey]);

    useEffect(() => {
        if (!isBellOpen) return undefined;
        const handleClickOutside = (event) => {
            if (!bellPanelRef.current?.contains(event.target)) setIsBellOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isBellOpen]);

    // Đóng mobile menu khi click outside
    useEffect(() => {
        if (!mobileMenuOpen) return undefined;
        const handleClickOutside = (event) => {
            if (!mobileMenuRef.current?.contains(event.target)) setMobileMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileMenuOpen]);

    // Đóng mobile menu khi chuyển trang
    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileDropdownOpen(null);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // Continue local cleanup even if API logout fails.
        } finally {
            clearCurrentUser();
            window.location.replace("/");
        }
    };

    const roleProfilePath = getRoleProfilePath(role);

    // Render một nav item (desktop)
    const renderDesktopNavItem = (item) => {
        // Item external (Trợ lý A*Care)
        if (item.isExternal) {
            return (
                <div key={item.id} className="header-items relative">
                    <a
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold flex items-center gap-1 text-[var(--brand-navy)] hover:text-[var(--brand-600)] transition-colors"
                    >
                        {item.name}
                    </a>
                </div>
            );
        }

        // Item có dropdown
        if (item.children) {
            const parentActive = isDropdownParentActive(item);
            return (
                <div key={item.id} className="header-items relative group">
                    <span className={`${parentActive ? 'text-[var(--brand-600)]' : 'text-[var(--brand-navy)]'} font-semibold flex items-center gap-1 cursor-default hover:text-[var(--brand-600)] transition-colors`}>
                        {item.name}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="w-3.5 h-3.5 mt-[1px]">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </span>
                    <div
                        className="invisible opacity-0 translate-y-2 scale-95
                            group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                            absolute left-1/2 -translate-x-1/2 mt-2 min-w-[220px]
                            rounded-xl bg-white shadow-xl transition-all duration-200 ease-out z-40"
                        role="menu"
                    >
                        <div className="absolute -top-2 left-0 right-0 h-2" />
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t border-slate-200" />
                        <ul className="py-2">
                            {item.children.map((c) => (
                                <li key={c.id} className="relative group/item">
                                    <NavLink
                                        to={c.to}
                                        className={({ isActive }) =>
                                            `${isActive ? 'text-[var(--brand-600)]' : 'text-[var(--brand-navy)]'} font-medium flex items-center justify-between gap-3 px-4 py-2.5 text-[15px] transition-colors hover:text-[var(--brand-600)] hover:bg-slate-100`}
                                        role="menuitem"
                                    >
                                        {c.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        // Item thường
        return (
            <div key={item.id} className="header-items relative">
                <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                        `${isActive ? 'text-[var(--brand-600)]' : 'text-[var(--brand-navy)]'} font-semibold flex items-center gap-1 hover:text-[var(--brand-600)] transition-colors`}
                >
                    {item.name}
                </NavLink>
            </div>
        );
    };

    return (
        <>
            <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/95 backdrop-blur">
                <div ref={containerRef} className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 md:px-8">
                    {/* Logo */}
                    <img
                        src={logo}
                        alt="logo"
                        className="logo h-24 w-36 md:h-28 md:w-44 bg-cover cursor-pointer object-contain flex-shrink-0"
                        onClick={() => navigate("/")}
                    />

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex flex-wrap gap-x-8 text-[var(--brand-navy)]">
                        {headerList.map((item) => renderDesktopNavItem(item))}
                    </nav>

                    {/* Right side: auth buttons + hamburger */}
                    <div className="flex items-center gap-x-3">
                        {/* Auth buttons — ẩn trên mobile nhỏ */}
                        <div className="hidden md:flex items-center gap-2">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => navigate(roleProfilePath)}
                                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-500)] hover:text-[var(--brand-600)]"
                                    >
                                        {getRoleLabel(role)}
                                    </button>

                                    {isNotificationEnabledRole ? (
                                        <div ref={bellPanelRef} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setIsBellOpen((prev) => !prev)}
                                                className="relative rounded-lg border border-slate-300 p-2 text-[var(--brand-navy)] hover:border-[var(--brand-500)] hover:text-[var(--brand-600)]"
                                                aria-label="Thông báo"
                                            >
                                                <FiBell size={18} />
                                                {notificationCount > 0 ? (
                                                    <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] leading-5 font-bold text-center">
                                                        {notificationCount > 5 ? "5+" : notificationCount}
                                                    </span>
                                                ) : null}
                                            </button>

                                            {isBellOpen ? (
                                                <div className="absolute right-0 mt-2 w-[380px] max-w-[90vw] rounded-xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
                                                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                                        <p className="text-sm font-bold text-slate-800">{notificationTitle}</p>
                                                        <span className="text-xs text-slate-500">{notificationCount > 5 ? "5+" : notificationCount}</span>
                                                    </div>

                                                    {notifications.length === 0 ? (
                                                        <p className="px-4 py-6 text-sm text-slate-500">Chưa có thông báo nào.</p>
                                                    ) : (
                                                        <div className="grid grid-cols-1 md:grid-cols-2">
                                                            <div className="max-h-72 overflow-auto border-r border-slate-200">
                                                                {notifications.map((notice) => (
                                                                    <button
                                                                        key={notice.id}
                                                                        type="button"
                                                                        onClick={() => setSelectedNotification(notice)}
                                                                        className={`w-full text-left px-3 py-2.5 border-b border-slate-100 hover:bg-slate-50 ${selectedNotification?.id === notice.id ? "bg-slate-100" : "bg-white"}`}
                                                                    >
                                                                        <p className="text-xs font-semibold text-slate-700 truncate">
                                                                            {normalizeNoticeMessage(notice.message)}
                                                                        </p>
                                                                        <p className="text-[11px] text-slate-500 mt-1">{formatNoticeTime(notice.time)}</p>
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <div className="p-3 min-h-[160px] flex flex-col justify-between">
                                                                <div>
                                                                    <p className="text-xs uppercase tracking-wide text-slate-500">Nội dung</p>
                                                                    <p className="text-sm text-slate-800 mt-2 leading-relaxed">
                                                                        {selectedNotification
                                                                            ? normalizeNoticeMessage(selectedNotification.message)
                                                                            : "Chọn một thông báo để xem chi tiết"}
                                                                    </p>
                                                                    {selectedNotification?.time ? (
                                                                        <p className="text-xs text-slate-500 mt-2">{formatNoticeTime(selectedNotification.time)}</p>
                                                                    ) : null}
                                                                </div>
                                                                <div className="pt-3 mt-3 border-t border-slate-200 flex justify-end">
                                                                    <button
                                                                        type="button"
                                                                        disabled={!selectedNotification || deletingNotificationId === selectedNotification?.id}
                                                                        onClick={async () => {
                                                                            if (!selectedNotification) return;
                                                                            const deletingItem = selectedNotification;
                                                                            const previousList = notifications;
                                                                            const previousCount = notificationCount;
                                                                            const nextList = previousList.filter((item) => item.id !== deletingItem.id);
                                                                            setNotifications(nextList);
                                                                            setSelectedNotification(nextList[0] || null);
                                                                            setNotificationCount(Math.max(0, Number(previousCount || 0) - 1));
                                                                            setDeletingNotificationId(deletingItem.id);
                                                                            try {
                                                                                if (role === "ADMIN") {
                                                                                    await activityService.deleteAdmin(deletingItem.id);
                                                                                } else {
                                                                                    await activityService.deleteByUser(userId, deletingItem.id);
                                                                                }
                                                                                setRefreshKey((prev) => prev + 1);
                                                                            } catch {
                                                                                setNotifications(previousList);
                                                                                setSelectedNotification(deletingItem);
                                                                                setNotificationCount(previousCount);
                                                                            } finally {
                                                                                setDeletingNotificationId(null);
                                                                            }
                                                                        }}
                                                                        className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                                                                    >
                                                                        <FiTrash2 size={14} />
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}

                                    <button
                                        onClick={handleLogout}
                                        className="rounded-lg bg-[var(--brand-600)] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)]"
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="rounded-lg bg-[var(--brand-600)] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[var(--brand-700)]"
                                >
                                    Đăng nhập
                                </button>
                            )}
                        </div>

                        {/* Hamburger — hiện trên < lg */}
                        <button
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="lg:hidden inline-flex items-center justify-center text-2xl border border-slate-300 rounded-lg p-2 cursor-pointer hover:border-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors"
                            aria-label="Mở menu"
                        >
                            <RiMenuFill />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-[1100] transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer panel */}
            <div
                ref={mobileMenuRef}
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[1200] transition-transform duration-300 flex flex-col ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <img src={logo} alt="logo" className="h-12 w-auto object-contain" />
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg text-slate-500 hover:text-[var(--brand-600)] hover:bg-slate-100 transition-colors"
                        aria-label="Đóng menu"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                    {headerList.map((item) => {
                        // External
                        if (item.isExternal) {
                            return (
                                <a
                                    key={item.id}
                                    href={item.to}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[var(--brand-navy)] hover:bg-sky-50 hover:text-[var(--brand-600)] transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-600)] flex-shrink-0" />
                                    {item.name}
                                </a>
                            );
                        }

                        // Dropdown
                        if (item.children) {
                            const parentActive = isDropdownParentActive(item);
                            const isOpen = mobileDropdownOpen === item.id;
                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={() => setMobileDropdownOpen(isOpen ? null : item.id)}
                                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${parentActive ? "text-[var(--brand-600)] bg-sky-50" : "text-[var(--brand-navy)] hover:bg-slate-100"}`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${parentActive ? "bg-[var(--brand-600)]" : "bg-slate-300"}`} />
                                            {item.name}
                                        </span>
                                        <FiChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} size={15} />
                                    </button>
                                    {isOpen && (
                                        <div className="ml-6 mt-1 space-y-1">
                                            {item.children.map((child) => (
                                                <NavLink
                                                    key={child.id}
                                                    to={child.to}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "text-[var(--brand-600)] bg-sky-50" : "text-slate-600 hover:bg-slate-100 hover:text-[var(--brand-600)]"}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    <FiChevronRight size={12} className="flex-shrink-0 opacity-50" />
                                                    {child.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Normal
                        return (
                            <NavLink
                                key={item.id}
                                to={item.to}
                                end={item.to === "/"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? "text-[var(--brand-600)] bg-sky-50" : "text-[var(--brand-navy)] hover:bg-slate-100"}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-[var(--brand-600)]" : "bg-slate-300"}`} />
                                        {item.name}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom auth section */}
                <div className="px-4 py-4 border-t border-slate-100 space-y-2">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => { navigate(roleProfilePath); setMobileMenuOpen(false); }}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-500)] hover:text-[var(--brand-600)] transition-colors"
                            >
                                {getRoleLabel(role)}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-lg bg-[var(--brand-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition-colors"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                            className="w-full rounded-lg bg-[var(--brand-600)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] transition-colors"
                        >
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default Header;
