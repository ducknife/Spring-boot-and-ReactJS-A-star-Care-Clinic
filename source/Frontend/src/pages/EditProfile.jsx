import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";import { getUserId, getUserRole } from "../utils/authUtils";
import { motion } from "framer-motion";
import { userService } from "../api/services";

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

// utils convert
const ymdToDmy = (ymd) => {
    if (!ymd) return "";
    const [y, m, d] = ymd.split("-");
    return `${d}/${m}/${y}`;
};
const dmyToYmd = (dmy) => {
    if (!dmy) return "";
    const [d, m, y] = dmy.split("/");
    return `${y}-${m}-${d}`;
};

function EditProfile() {
    const navigate = useNavigate();
    const id = getUserId();
    const role = getUserRole();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        gender: "OTHER",
        birthDate: "",
        address: "",
        idNumber: "",
        passwordHash: "",
        email: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const data = await userService.getById(id);

                setForm({
                    fullName: data?.fullName || "",
                    phone: data?.phone || "",
                    gender: data?.gender || "",
                    address: data?.address || "",
                    birthDate: dmyToYmd(data?.birthDate) || "",
                    idNumber: data?.idNumber || "",
                    passwordHash: data?.passwordHash || "",
                    email: data?.email || "",
                })
            }
            catch (e) {
                setError(e?.message || "Không tải được dữ liệu");
            }
            finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const data = {
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                gender: form.gender,
                birthDate: ymdToDmy(form.birthDate),
                address: form.address.trim(),
                idNumber: form.idNumber.trim(),
                passwordHash: form.passwordHash.trim(),
                email: form.email.trim()
            };

            if (confirm("Xác nhận lưu thay đổi")) {
                await userService.update(id, data);
                navigate(`/${role == "PATIENT" ? 'patient' : 'doctor'}/profile`);
            }

        }
        catch (e) {
            setError(e?.message || "Cập nhật thất bại");
        }
        finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Đang tải...</div>;
    return (
        <div className="bg-sky-500">
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-[url(../../assets/images/booking/booking-bg.png)] bg-cover min-h-screen p-10"
            >
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="w-[50vw] mx-auto p-6 rounded-4xl bg-white shadow-2xl"
                >
                    <motion.h1 variants={item} className="w-full p-3 rounded-xl text-3xl font-semibold mb-3 text-[#00278D]">
                        Chỉnh sửa hồ sơ
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
                            <label className="block text-slate-800 text-sm mb-1">Họ và tên</label>
                            <input
                                name="fullName" value={form.fullName} onChange={onChange} required
                                className="w-full text-slate-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Số điện thoại</label>
                            <input
                                name="phone" value={form.phone} onChange={onChange}
                                pattern="\+?\d{9,15}" placeholder="VD: 0901234567"
                                className="w-full border text-slate-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Email</label>
                            <input
                                name="email" value={form.email} onChange={onChange}
                                placeholder="VD: hung.clinic@ptit.edu.vn"
                                className="w-full border text-slate-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Mật khẩu</label>
                            <input
                                name="passwordHash" value={form.passwordHash} onChange={onChange}
                                placeholder="VD: ******"
                                className="w-full border text-slate-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Giới tính</label>
                            <select
                                name="gender" value={form.gender} onChange={onChange}
                                className="w-full border text-slate-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            >
                                <option value="" disabled>-- Chọn giới tính --</option>
                                <option value={"MALE"}>Nam</option>
                                <option value={"FEMALE"}>Nữ</option>
                                <option value={"OTHER"}>Khác</option>
                            </select>
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Ngày sinh</label>
                            <input
                                type="date" name="birthDate" value={form.birthDate || ""} onChange={onChange}
                                className="w-full border text-slate-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">Địa chỉ</label>
                            <input
                                name="address" value={form.address} onChange={onChange}
                                className="w-full border text-slate-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
                        </motion.div>

                        <motion.div variants={item}>
                            <label className="block text-slate-800 text-sm mb-1">CMND/CCCD</label>
                            <input
                                name="idNumber" value={form.idNumber} onChange={onChange}
                                className="w-full border text-slate-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                            />
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
                                onClick={() => navigate(`/${role == "PATIENT" ? 'patient' : 'doctor'}/profile`)}
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

export default EditProfile;