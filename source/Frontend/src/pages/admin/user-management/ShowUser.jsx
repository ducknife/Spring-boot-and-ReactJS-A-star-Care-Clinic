import { useEffect, useState } from "react";import { useNavigate, useParams } from "react-router-dom";
import { motion, } from "framer-motion";
import doctorImg from "../../../assets/images/doctor/doctor.jpg";
import patientImg from "../../../assets/images/doctor/patient.jpg";
import adminImg from "../../../assets/images/doctor/admin.jpg";
import { userService } from "../../../api/services";

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


function AdminShowProfile() {

    const navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userService.getById(id);
                setProfile(data);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
            
        }
        fetchUser();
    }, []);

    if (loading) return <div className="loading-profile text-center p-4">Đang tải hồ sơ người dùng ... </div>
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-[100vh] bg-[url(../../assets/images/profile/profile-bg.jpg)] bg-cover"
        >
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-6xl p-6"
            >
                <motion.div variants={item} className="rounded-3xl bg-white border border-gray-100 shadow-xl">
                    <div className="p-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
                        {/* Ảnh */}
                        <motion.div variants={item} className="flex md:block justify-center">
                            <div className="relative">
                                <motion.img
                                    src={profile.role == "ADMIN" ? adminImg : profile.role == "PATIENT" ? patientImg : doctorImg}
                                    alt="anh nguoi dung"
                                    className="object-cover user-image w-40 h-40 rounded-full object-cover ring-4 ring-white shadow-md border border-sky-200"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                                />
                                <motion.div
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 180, damping: 25, delay: 0.2 }}
                                    className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs rounded-full ${profile.role == "ADMIN" ? "bg-red-500" : profile.role == "PATIENT" ? "bg-sky-500" : "bg-green-500"}  text-white shadow`}
                                >
                                    {profile.role}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Thông tin */}
                        <div className="space-y-6">
                            <motion.h1 variants={item} className="text-2xl font-semibold tracking-tight text-[#00278D]">
                                TÊN {profile.role + ": "}
                                <span className="text-[#00278D]">{profile.fullName}</span>
                            </motion.h1>

                            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-[15px] text-slate-800">
                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Email</div>
                                    <div className="font-medium">{profile.email}</div>
                                </motion.div>

                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Số điện thoại</div>
                                    <div className="font-medium">{profile.phone}</div>
                                </motion.div>

                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Số CCCD</div>
                                    <div className="font-medium">{profile.idNumber}</div>
                                </motion.div>

                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Vai trò</div>
                                    <div className="font-medium">
                                        {profile.role}
                                    </div>
                                </motion.div>

                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Mật khẩu</div>
                                    <div className="font-medium">
                                        {profile.passwordHash}
                                    </div>
                                </motion.div>

                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Giới tính</div>
                                    <div className="font-medium">
                                        {profile.gender === "MALE" ? "Nam" : profile.gender === "FEMALE" ? "Nữ" : "Khác"}
                                    </div>
                                </motion.div>

                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Ngày sinh</div>
                                    <div className="font-medium">{profile.birthDate}</div>
                                </motion.div>

                                <motion.div variants={item} className="flex gap-3">
                                    <div className="w-32 shrink-0 text-slate-500">Địa chỉ</div>
                                    <div className="font-medium">{profile.address}</div>
                                </motion.div>
                            </motion.div>

                            <motion.div className="flex items-center justify-between">
                                <motion.div variants={item} className="pt-4 border-t border-slate-100 text-sm text-slate-600">
                                    Ngày tạo hồ sơ: <span className="font-medium">{profile.createdAt}</span>
                                </motion.div>
                                <motion.button variants={item} onClick={() => navigate("/admin/users")} className="mt-4 bg-[#00278D] text-white rounded-md p-2 px-5 cursor-pointer hover:bg-sky-500">Quay lại</motion.button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default AdminShowProfile;