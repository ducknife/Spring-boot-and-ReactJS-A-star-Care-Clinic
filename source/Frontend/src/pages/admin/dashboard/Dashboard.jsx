import { useEffect, useState } from "react";
import DashboardReportTable from "./DashboardReportTable";
import { motion } from "framer-motion";
import { activityService, appointmentService, serviceService, userService } from "../../../api/services";

function Dashboard() {

    const [users, setUsers] = useState([]);
    const [aptToday, setAptToday] = useState([]);
    const [upcommingApt, setUpcommingApt] = useState([]);
    const [monthRevenue, setMonthRevenue] = useState(0);
    const [logs, setLogs] = useState([]);
    const [month, setMonth] = useState("--");
    const [year, setYear] = useState("--");

    const convertTimeFormat = (a) => {
        var res = "";
        var x;
        for (x in a) {
            if (a[x] != "T") res += a[x];
            else res += " ";
        }
        const part = res.split(" ");
        const dmy = part[0];
        const time = part[1];
        const partDmy = dmy.split("-");
        return time + " " + partDmy[2] + "/" + partDmy[1] + "/" + partDmy[0];
    }

    useEffect(() => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        setMonth(month);
        setYear(year);
        /* Lấy người dùng */
        const getUserData = async () => {
            try {
                const data = await userService.getAll();
                setUsers(data);
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getUserData();

        /* lấy cuộc hẹn hôm nay */
        const getAptToday = async () => {
            try {
                const data = await appointmentService.getToday();
                setAptToday(data);
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getAptToday();

        /* lấy cuộc hẹn sắp tới: status = "PENDING" */
        const getUpcommingAppointment = async () => {
            try {
                const data = await appointmentService.pendingToday();
                setUpcommingApt(data);
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getUpcommingAppointment();

        /* lấy doanh thu tháng này: từ mùng 1 tới hiện tại */
        const getMonthRevenue = async () => {
            try {
                const data = await appointmentService.doneThisMonth();
                var sum = 0;
                for (const a of data) {
                    const serviceId = parseInt(a.note);
                    const service = await serviceService.getById(serviceId);
                    sum += service.price;
                }
                setMonthRevenue(sum);
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getMonthRevenue();

        /* lấy hoạt động gần dây */
        const getLogs = async () => {
            try {
                const data = await activityService.getRecent();
                setLogs(data);
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getLogs();
    }, []);
    const stats = [
        { id: 1, icon: <FiUsers />, label: "Người dùng", value: users.length, to: "/admin/users" },
        { id: 2, icon: <FiActivity />, label: "Cuộc hẹn hôm nay", value: aptToday.length },
        { id: 3, icon: <FiCalendar />, label: "Lịch sắp tới trong ngày", value: upcommingApt.length },
        { id: 4, icon: <FiBarChart2 />, label: `Doanh thu tháng ${month}/${year}`, value: monthRevenue.toLocaleString("vi-VN") + " ₫" },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-tl from-sky-50 via-white to-sky-500 text-slate-800"
        >
            {/* HEADER */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-7xl mx-auto flex items-center justify-between p-6"
            >
                <h1 className="text-3xl font-bold p-2 rounded-xl shadow-xl text-[#00278D] bg-white">
                    Xin chào! Quản trị viên A<sup className="text-yellow-500">*</sup><span className="text-sky-500">Care</span>
                </h1>
            </motion.div>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
                {/* STATS */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((s, i) => (
                        <NavLink key={s.id} to={s.to}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="cursor-pointer hover:bg-sky-200 group relative overflow-hidden rounded-3xl p-6 bg-white/70 backdrop-blur-md shadow-slate-300 shadow-2xl hover:shadow-xl transition-all duration-300"
                            >
                                <div className="absolute inset-0"></div>
                                <div className="relative z-10">
                                    <div className="rounded-xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-sky-500 to-sky-400 text-white rounded-2xl shadow-md text-xl">
                                        {s.icon}
                                    </div>
                                    <div className="mt-5">
                                        <h3 className="text-sm font-medium text-slate-500">
                                            {s.label}
                                        </h3>
                                        <p className="text-3xl font-extrabold text-[#00278D] mt-1 tracking-tight">
                                            {s.value}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </NavLink>
                    ))}
                </motion.div>

                {/* CONTENT */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* BIỂU ĐỒ */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-300 hover:shadow-xl transition-all duration-300 p-8"
                    >
                        <DashboardReportTable />
                    </motion.div>

                    {/* HOẠT ĐỘNG GẦN ĐÂY */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-xl transition-all duration-300 p-8"
                    >
                        <h2 className="text-xl font-semibold text-[#00278D] mb-5">
                            Hoạt động gần đây
                        </h2>
                        <ul className="space-y-5">
                            {logs.map((l) => (
                                <li key={l.id} className="flex items-start gap-3 text-slate-600 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-sky-500 mt-1"></div>
                                    <p><span className="font-bold">{l.type + ": "}</span>{l.message + " lúc " + convertTimeFormat(l.time)}</p>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            </main>
        </motion.div>
    );
}

export default Dashboard;

