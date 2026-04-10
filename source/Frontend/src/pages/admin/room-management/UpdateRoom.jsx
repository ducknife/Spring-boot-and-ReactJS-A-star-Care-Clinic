import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { roomService } from "../../../api/services";

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


function EditRoom() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        location: "",
        roomType: "",
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        const getRoomInfo = async () => {
            try {
                const data = await roomService.getById(id);
                setForm({
                    name: data.name,
                    location: data.location,
                    roomType: data.roomType
                })
            }
            catch (error) {
                console.log(error.message);
            }
        }
        getRoomInfo();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try {
            const data = {
                name: form.name,
                location: form.location,
                roomType: form.roomType
            };

            if (confirm("Xác nhận thêm phòng")) {
                const response = await roomService.update(id, data);
                navigate("/admin/rooms");
            }

        }
        catch (e) {
            setError(e?.message || "Thêm thất bại");
        }
    };

    return (
        <div className="bg-sky-500">
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-gradient-to-tl from-sky-50 via-white to-sky-500 min-h-screen p-10"
            >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="w-[50vw] mx-auto p-6 rounded-4xl bg-white shadow-2xl"
                >
                    <motion.h1 variants={item} className="w-full p-3 rounded-xl text-3xl font-semibold mb-3 text-[#00278D]">
                        Sửa phòng
                    </motion.h1>

                    {error && (
                        <motion.div
                            variants={item}
                            className="mb-3 text-red-500"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.form
                        onSubmit={onSubmit}
                        className="space-y-3 md:grid md:grid-cols-2 md:gap-5"
                    >
                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Tên phòng</label>
                            <input
                                name="name" value={form.name} onChange={handleChange} required
                                className="w-full text-slate-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Tầng</label>
                            <input
                                name="location" value={form.location} onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none
                                                        focus:ring-2 focus:ring-sky-500 focus:border-transparent transition" required
                            >
                            </input>
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Loại phòng</label>
                            <input
                                name="roomType" value={form.roomType} onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none
                                                        focus:ring-2 focus:ring-sky-500 focus:border-transparent transition" required
                            >
                            </input>
                        </motion.div>

                        <motion.div variants={item} className="pt-2 flex gap-2 col-span-2">
                            <motion.button
                                type="submit"
                                disabled={saving}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-60 transition duration-400 cursor-pointer"
                            >
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={() => navigate("/admin/rooms")}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                                className="px-4 py-2 cursor-pointer rounded-xl bg-rose-400 text-white hover:bg-rose-500 transition duration-400"
                            >
                                Huỷ
                            </motion.button>
                        </motion.div>
                    </motion.form>
                </motion.div>
            </motion.section>
        </div>
    );
}

export default EditRoom;