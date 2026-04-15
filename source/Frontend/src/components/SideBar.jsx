import { useSidebarContext } from "../contexts/SideBarContext";
import logo from "../assets/images/logo/logo_png.png";
import { NavLink, useNavigate } from "react-router-dom";
import { clearCurrentUser, getRoleProfilePath } from "../utils/authUtils";
import { useMemo, useState } from "react";
import { headerListByRole } from "../data/headerList";
import useAuthSnapshot from "../hooks/useAuthSnapshot";
import { authService } from "../api";

function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebarContext();
  const { isLoggedIn, role } = useAuthSnapshot();
  const navigate = useNavigate();
  const [pagesOpen, setPagesOpen] = useState(false);

  const menu = useMemo(() => {
    const currentRole = role || "GUEST";
    return headerListByRole[currentRole] || headerListByRole.GUEST;
  }, [role]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue local cleanup even if server logout fails.
    } finally {
      clearCurrentUser();
      toggleSidebar();
      window.location.replace("/");
    }
  };

  const roleProfilePath = getRoleProfilePath(role);

  return (
    <>
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 transition-opacity z-1000 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-10000 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 flex justify-between items-center pt-0">
          <img src={logo} alt="logo" className="logo bg-cover w-45 h-30" />
        </div>
        <div className="about-us text-[var(--brand-navy)] p-10 pt-0 pb-5">
          <h2 className="text-2xl font-black">Về chúng tôi</h2>
          <div className="w-15 h-1 bg-[var(--brand-600)] mt-1"></div>
          <p className="font-regular text-slate-700 pt-5">
            <span className="font-extrabold text-[var(--brand-navy)]">A<sup className="text-[var(--brand-600)]">*</sup><span className="text-[var(--brand-600)]">Care</span></span> tự hào là đơn vị chăm sóc sức khỏe
            uy tín, mang đến dịch vụ tận tâm – hiện đại – an toàn cho mọi khách hàng.
          </p>
        </div>
        <nav className="p-10 font-semibold space-y-2 pt-0 text-[var(--brand-navy)]">
          {menu.map((item) => {
            if (item.children?.length) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => setPagesOpen((prev) => !prev)}
                    className="w-full text-left p-2 hover:bg-slate-100 rounded flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    <span className={`transition-transform ${pagesOpen ? "rotate-180" : ""}`}>
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[var(--brand-navy)] pointer-events-none"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  {pagesOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.id}
                          to={child.to}
                          onClick={toggleSidebar}
                          className="block p-2 text-sm hover:bg-slate-100 rounded"
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.id}
                to={item.to}
                onClick={toggleSidebar}
                className="block p-2 hover:bg-slate-100 rounded"
              >
                {item.name}
              </NavLink>
            );
          })}

          {isLoggedIn ? (
            <>
              <NavLink to={roleProfilePath} onClick={toggleSidebar} className="block p-2 hover:bg-slate-100 rounded">
                Hồ sơ cá nhân
              </NavLink>
              <button
                onClick={handleLogout}
                className="login-button bg-slate-700 text-white text-center w-full p-2 rounded-xl hover:bg-slate-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={toggleSidebar}>
              <button className="login-button bg-[var(--brand-600)] text-white text-center w-full p-2 rounded-xl hover:bg-[var(--brand-700)]">
                Đăng nhập
              </button>
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;