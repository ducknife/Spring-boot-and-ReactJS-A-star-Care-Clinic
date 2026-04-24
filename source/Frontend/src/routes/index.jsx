import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/home/Home";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Services from "../pages/Services";
import Doctors from "../pages/Doctors";
import Booking from "../pages/patient/Booking";
import Payment from "../pages/patient/Payment";
import EditProfile from "../pages/EditProfile";
import Cart from "../pages/patient/Cart";
import { getRoleHomePath } from "../utils/authUtils";
import HistoryPage from "../pages/patient/HistoryPage";
import EditAppointment from "../pages/patient/EditAppointment";
import Register from "../pages/auth/Register";
import Schedule from "../pages/doctor/Schedule";
import Statistic from "../pages/doctor/Statistic";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import AdminUserManagement from "../pages/admin/user-management/Users";
import AdminEditProfile from "../pages/admin/user-management/UpdateUser";
import AdminShowProfile from "../pages/admin/user-management/ShowUser";
import AdminServiceManagement from "../pages/admin/service-management/Services";
import AdminStatistics from "../pages/admin/statistics/AdminStatistics";
import AddUser from "../pages/admin/user-management/AddUser";
import AdminShowService from "../pages/admin/service-management/ShowService";
import AdminEditService from "../pages/admin/service-management/UpdateService";
import AddService from "../pages/admin/service-management/AddService";
import About from "../pages/About";
import Instruction from "../pages/Instruction";
import FAQ from "../pages/FAQ";
import Contact from "../pages/Contact";
import Forbidden from "../pages/Forbidden";
import useAuthSnapshot from "../hooks/useAuthSnapshot";

function PublicOnlyRoute() {
    const { role, isLoggedIn } = useAuthSnapshot();
    if (isLoggedIn) {
        return <Navigate to={getRoleHomePath(role)} replace />;
    }
    return <Outlet />
}

function RequiredRole({ allowed }) {
    const { role, isLoggedIn } = useAuthSnapshot();
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (!allowed.includes(role)) return <Navigate to="/403" replace />;
    return <Outlet />;
}

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/services", element: <Services /> },
            { path: "/doctors", element: <Doctors /> },
            { path: "/about", element: <About /> },
            { path: "/instruction", element: <Instruction /> },
            { path: "/faq", element: <FAQ /> },
            { path: "/contact", element: <Contact /> },
            { path: "/contact", element: <Contact /> },
            {
                element: <RequiredRole allowed={["PATIENT"]} />,
                children: [
                    {
                        path: "/patient", element: <Home />,
                        children: [
                            { path: "book", element: <Booking /> },
                            { path: "payment", element: <Payment /> },
                            { path: "profile", element: <EditProfile /> },
                            { path: "edit", element: <EditProfile /> },
                            { path: "appointments", element: <Cart />, },
                            { path: "cart", element: <Navigate to="/patient/appointments" replace /> },
                            { path: "history", element: <HistoryPage /> },
                            { path: "edit-appointment/:id", element: <EditAppointment /> }
                        ],
                    }
                ]
            },
            {
                element: <RequiredRole allowed={["DOCTOR"]} />,
                children: [
                    {
                        path: "/doctor", element: <Home />,
                        children: [
                            { path: "profile", element: <EditProfile /> },
                            { path: "edit", element: <EditProfile /> },
                            { path: "schedule", element: <Schedule /> },
                            { path: "reports", element: <Statistic /> },
                        ]
                    }
                ]
            },
            {
                element: <RequiredRole allowed={["ADMIN"]} />,
                children: [
                    {
                        path: "admin", element: <Home />,
                        children: [
                            { path: "dashboard", element: <Dashboard /> },
                            { path: "profile", element: <AdminEditProfile /> },
                            { path: "edit", element: <Navigate to="/admin/profile" replace /> },
                            { path: "users", element: <AdminUserManagement /> },
                            { path: "edit-user/:id", element: <AdminEditProfile /> },
                            { path: "show-user/:id", element: <AdminShowProfile /> },
                            { path: "add-user", element: <AddUser /> },
                            { path: "services", element: <AdminServiceManagement /> },
                            { path: "statistics", element: <AdminStatistics /> },
                            { path: "edit-service/:id", element: <AdminEditService /> },
                            { path: "add-service", element: <AddService /> }
                        ]
                    }
                ]
            },
            { path: "show-service/:id", element: <AdminShowService /> },
        ],
    },
    {
        element: <PublicOnlyRoute />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
    { path: "/403", element: <Forbidden /> },
    { path: "*", element: <NotFound /> },
]);

export default router;
