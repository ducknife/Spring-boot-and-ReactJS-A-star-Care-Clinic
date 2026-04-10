import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MdOutlineCancel } from "react-icons/md";
import { getUserId } from "../../utils/authUtils";
import { appointmentService, userService } from "../../api/services";

const container = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1, y: 0,
        transition: {
            when: "beforeChildren", staggerChildren: 0.06, duration: 0.3, ease: "easeOut"
        }
    }
};
const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1, y: 0, transition: {
            duration: 0.3, ease: "easeOut"
        }
    }
};

function PatientCard({ p }) {
    return (
        <motion.div
            variants={item}
            whileHover={{ y: 0 }}
            transition={{ type: "spring", damping: 24 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition duration-200 p-5"
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    {p.fullName?.charAt(0) ?? "?"}
                </div>
                <h3 className="text-lg font-semibold text-[#00278D]">{p.fullName || "—"}</h3>
            </div>

            <ul className="text-slate-700 text-sm space-y-2">
                <li className="flex">
                    <span className="w-28 text-slate-500">CCCD/CMND</span>
                    <span className="font-medium break-all">{p.idNumber || "—"}</span>
                </li>
                <li className="flex">
                    <span className="w-28 text-slate-500">Ngày sinh</span>
                    <span className="font-medium">{p.birthDate || "—"}</span>
                </li>
                <li className="flex">
                    <span className="w-28 text-slate-500">Điện thoại</span>
                    <span className="font-medium">{p.phone || "—"}</span>
                </li>
                <li className="flex">
                    <span className="w-28 text-slate-500">Địa chỉ</span>
                    <span className="font-medium line-clamp-2">{p.address || "—"}</span>
                </li>
            </ul>
        </motion.div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="h-5 w-40 bg-slate-200 rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-2/3 bg-slate-200 rounded" />
                <div className="h-4 w-4/5 bg-slate-200 rounded" />
            </div>
        </div>
    );
}

function Patients() {
    const [patients, setPatients] = useState([]);
    const [q, setQ] = useState("");
    const [sortBy, setSortBy] = useState("name"); // name | dob | id
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const doctorId = getUserId();

    useEffect(() => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        const getPatients = async () => {
            try {
                const appoinments = await appointmentService.getByDoctorId(doctorId);
                const patientSet = new Set(appoinments.map(a => a.patientId));
                const list = await Promise.all(
                    Array.from(patientSet).map(async (patientId) => {
                        const response = await userService.getById(patientId);
                        return {
                            id: patientId,
                            fullName: response?.fullName || "",
                            idNumber: response?.idNumber || "",
                            birthDate: response?.birthDate || "",
                            phone: response?.phone || "",
                            address: response?.address || "",
                        };
                    })
                );
                setPatients(list);

            }
            catch (error) {
                setErr(error.message);
            }
            finally {
                setLoading(false);
            }
        }
        getPatients();
    }, [doctorId]);

    const filtered = useMemo(() => {
        const text = q.trim().toLowerCase();

        const sorted = [...patients]
            .filter(p =>
                !text ||
                [p.fullName, p.idNumber, p.phone]
                    .some(field => field?.toLowerCase().includes(text))
            )
            .sort((a, b) => {
                const key =
                    sortBy === "dob" ? "birthDate" :
                        sortBy === "id" ? "idNumber" :
                            "fullName";
                return (a[key] || "").localeCompare(b[key] || "");
            });
        return sorted;
    }, [patients, q, sortBy]);

    return (
        <div className="bg-gradient-to-tl from-sky-50 via-white to-sky-500 min-h-screen p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                    className="flex justify-between items-center mb-6 bg-white w-fit h-fit px-4 py-3 rounded-2xl shadow-xl"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-[#00278D]">Danh sách bệnh nhân</h1>
                </motion.div>
            </div>

            {/* Toolbar */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between max-w-7xl mx-auto"
            >
                <motion.div variants={item} className="flex-1">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm theo tên / CCCD / SĐT…"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </motion.div>
                <motion.div variants={item} className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm">Sắp xếp:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-slate-200 text-slate-600 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="name" >Theo tên</option>
                        <option value="dob">Theo ngày sinh</option>
                        <option value="id">Theo CCCD</option>
                    </select>
                </motion.div>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : err ? (
                <div className="text-red-600">{err}</div>
            ) : filtered.length ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                >
                    {filtered.map((p) => (
                        <PatientCard key={p.id} p={p} />
                    ))}
                </motion.div>
            ) : (
                <div className="text-[#00278D] text-lg max-w-7xl mx-auto">Không tìm thấy bệnh nhân nào.</div>
            )}
        </div>
    );
}
export default Patients;