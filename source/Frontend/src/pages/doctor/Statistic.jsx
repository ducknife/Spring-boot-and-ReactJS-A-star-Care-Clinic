import { useEffect, useState } from "react";
import { MdPerson2 } from "react-icons/md";
import { GrFormSchedule } from "react-icons/gr";
import { GiTrophyCup } from "react-icons/gi";
import { RiServiceLine } from "react-icons/ri";
import { getUserId } from "../../utils/authUtils";
import { motion } from "framer-motion";
import { appointmentService, serviceService, userService } from "../../api/services";

const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1, y: 0,
        transition: { duration: 0.35, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.06 }
    }
};
const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const convertTimeFormat = (startTime) => {
    var result = ''
    for (var x of startTime) {
        if (x == 'T') break;
        else result += x;
    }
    const [y, m, d] = result.split("-");
    return `${d}/${m}/${y}`;
}

function Statistic() {

    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        revenue: 0,
        topService: "—",
    });

    const doctorId = getUserId();
    const [recentEncounters, setRecentEncounters] = useState([]);

    useEffect(() => {
        if (!doctorId) return;

        const getAppointment = async () => {
            try {
                const data = await appointmentService.doneThisMonthByDoctorId(doctorId);
                const totalAppointments = data.length;
                const patientIdSet = new Set(data.map((a) => a.patientId));
                const totalPatients = patientIdSet.size;
                const freq = new Map();
                let totalRevenue = 0;
                const recents = await Promise.all(
                    data.map(async (a) => {
                        const serviceId = Number.parseInt(a.note, 10);
                        const [serviceResp, patientResp] = await Promise.all([
                            Number.isNaN(serviceId) ? Promise.resolve(null) : serviceService.getById(serviceId),
                            userService.getById(a.patientId),
                        ]);

                        const serviceName = serviceResp?.name || "Khac";
                        totalRevenue += serviceResp?.price || 0;
                        freq.set(serviceName, (freq.get(serviceName) || 0) + 1);

                        return {
                            startTime: a.startTime,
                            serviceName,
                            price: serviceResp?.price || 0,
                            patientName: patientResp?.fullName || "",
                        };
                    })
                );

                setRecentEncounters(recents);

                /* lấy dịch vụ nổi bật nhất */
                var topService = "—";
                var maxCount = 0;
                for (const [service, count] of freq.entries()) {
                    if (count > maxCount) {
                        maxCount = count;
                        topService = service;
                    }
                }

                setStats({
                    patients: totalPatients,
                    appointments: totalAppointments,
                    revenue: totalRevenue,
                    topService: topService
                })
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getAppointment();
    }, [doctorId]);

    return (
        <section className="bg-gradient-to-tl from-sky-50 via-white to-sky-500 min-h-[40vh] text-slate-700 p-10 ">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    className="flex justify-between items-center mb-8 bg-white w-fit h-fit p-3 rounded-2xl shadow-lg"
                >
                    <h1 className="text-4xl font-bold text-[#00278D]">Thống kê tổng quan</h1>
                </motion.div>
            </div>

            {/* Cards thống kê */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-4 gap-6 mb-10 max-w-7xl mx-auto"
            >
                <motion.div variants={item}><Card title="Bệnh nhân" value={stats.patients} icon={<MdPerson2 />} /></motion.div>
                <motion.div variants={item}><Card title="Lịch hẹn đã xong" value={stats.appointments} icon={<GrFormSchedule />} /></motion.div>
                <motion.div variants={item}><Card title="Doanh thu" value={stats.revenue.toLocaleString("vi-VN") + " ₫"} icon={<GiTrophyCup />} /></motion.div>
                <motion.div variants={item}><Card title="Dịch vụ nổi bật" value={stats.topService} icon={<RiServiceLine />} /></motion.div>
            </motion.div>

            {/* Bảng danh sách gần đây */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.1 }}
                className="bg-white rounded-t-2xl shadow-2xl border border-sky-100 overflow-hidden max-w-7xl mx-auto"
            >
                <motion.div
                    variants={item}
                    className="p-5 border-b border-sky-100 bg-white rounded-t-2xl"
                >
                    <h2 className="text-xl font-semibold text-[#00278D]">
                        Các ca khám đã xong gần đây
                    </h2>
                </motion.div>

                <motion.table
                    variants={item}
                    className="w-full border-collapse"
                >
                    <thead>
                        <tr className="text-left text-[#00278D] border-b border-sky-100 bg-white">
                            <th className="p-3">STT</th>
                            <th className="p-3">Bệnh nhân</th>
                            <th className="p-3">Ngày khám</th>
                            <th className="p-3">Dịch vụ</th>
                            <th className="p-3">Thành tiền</th>
                        </tr>
                    </thead>
                    <motion.tbody variants={container}>
                        {recentEncounters.map((recent, idx) => (
                            <motion.tr
                                key={idx}
                                variants={item}
                                whileHover={{ backgroundColor: "rgba(224,242,254,0.5)" }}
                                className="hover:bg-sky-50 transition border-b last:border-none"
                            >
                                <td className="p-3">{idx + 1}</td>
                                <td className="p-3">{recent.patientName}</td>
                                <td className="p-3">{convertTimeFormat(recent.startTime)}</td>
                                <td className="p-3 text-slate-600">{recent.serviceName}</td>
                                <td className="p-3 text-slate-600">{recent.price.toLocaleString("vi-VN") + " ₫"}</td>
                            </motion.tr>
                        ))}
                    </motion.tbody>
                </motion.table>
            </motion.div>
        </section>
    );
}

// Card thống kê
function Card({ title, value, icon }) {
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl hover:shadow-md transition p-6 flex flex-col items-start">
            <div className="text-4xl mb-3 text-sky-500">{icon}</div>
            <h3 className="text-slate-500 text-sm uppercase">{title}</h3>
            <p className="text-2xl font-bold text-[#00278D]">{value}</p>
        </div>
    );
}

export default Statistic;