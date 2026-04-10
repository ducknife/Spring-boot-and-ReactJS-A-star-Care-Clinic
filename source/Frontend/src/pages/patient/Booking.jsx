import { useEffect, useState } from "react";
import { appointmentService, roomService, serviceService, userService } from "../../api/services";

const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1, y: 0,
        transition: { duration: 0.2, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.05 }
    }
};
const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

function Booking() {
    const [form, setForm] = useState({
        patientId: getUserId(),
        doctorId: "",
        roomId: "",
        startTime: "",
        note: "",
    });

    const [message, setMessage] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [services, setServices] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await appointmentService.create(form);
            if (data.status == 404) throw new Error(data.message);
            setMessage("Đặt lịch thành công với mã " + data.data.id);
        }
        catch (err) {
            setMessage(err.message);
        }
    };

    useEffect(() => {
        const fetchDoctor = async () => {
            const data = await userService.getDoctors();
            setDoctors(data);
        }
        fetchDoctor();

        const fetchRoom = async () => {
            const data = await roomService.getAll();
            setRooms(data);
        }
        fetchRoom();

        const fetchService = async () => {
            const data = await serviceService.getAll();
            setServices(data);
        }
        fetchService();
    }, []);

    return (
        <div className="bg-sky-500">
            <section className="relative flex justify-center items-center min-h-screen bg-gradient-to-tl from-sky-50 via-white to-sky-500">
                {/* overlay làm nổi form */}
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
                <motion.form
                    onSubmit={handleSubmit}
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative bg-white/95 shadow-2xl p-8 rounded-2xl w-full max-w-lg ring-1 ring-sky-100"
                >
                    <motion.h2 variants={item} className="text-2xl font-bold mb-6 text-[#00278D]">
                        Đặt lịch khám
                    </motion.h2>

                    <div className="space-y-4 text-slate-600">
                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Mã bệnh nhân</label>
                            <input
                                type="text" name="patientId" value={form.patientId} onChange={handleChange}
                                className="w-full border border-gray-300 bg-gray-200 p-2 rounded-md text-slate-600
                                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                                disabled
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Bác sĩ</label>
                            <select
                                name="doctorId" value={form.doctorId} onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none
                                focus:ring-2 focus:ring-sky-500 focus:border-transparent transition" required
                            >
                                <option value="" disabled>-- Chọn bác sĩ --</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
                            </select>
                        </motion.div>
                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Phòng</label>
                            <select
                                name="roomId" value={form.roomId} onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none
                                focus:ring-2 focus:ring-sky-500 focus:border-transparent transition" required
                            >
                                <option value="" disabled>-- Chọn phòng --</option>
                                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Thời gian bắt đầu</label>
                            <input
                                type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange}
                                min={new Date().toISOString().slice(0, 16)} // chặn chọn quá khứ (optional)
                                className="w-full border border-gray-300 p-2 rounded-md text-gray-700
                                focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition" required
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Dịch vụ</label>
                            <select
                                name="note" value={form.note} onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none
                                focus:ring-2 focus:ring-sky-500 focus:border-transparent transition" required
                            >
                                <option value="" disabled>-- Chọn dịch vụ --</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </motion.div>
                    </div>

                    <motion.button
                        type="submit"
                        className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold shadow
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Đặt lịch ngay
                    </motion.button>

                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-center text-sky-700"
                        >
                            {message}
                        </motion.p>
                    )}
                </motion.form>
            </section>

        </div>
    );
}

export default Booking;