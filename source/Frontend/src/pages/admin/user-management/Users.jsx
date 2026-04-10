import { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";import { useNavigate } from "react-router-dom";import { IoMdPersonAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { userService } from "../../../api/services";

function AdminUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // State cho search
    const [searchParams, setSearchParams] = useState({
        fullName: '',
        role: '',
        email: ''
    });

    // Lấy danh sách user
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userService.getAll();
                setUsers(response);
            }
            catch (err) {
                console.error("Error fetching users:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Xử lý thay đổi search input
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý tìm kiếm
    const handleSearch = async () => {
        setLoading(true);
        try {
            const searchResults = await userService.search(searchParams);
            setUsers(searchResults);
        } 
        catch (err) {
            console.error("Error searching users:", err);
        } 
        finally {
            setLoading(false);
        }
    };

    // Reset search
    const handleReset = async () => {
        setSearchParams({
            fullName: '',
            role: '',
            email: ''
        });
        setLoading(true);
        try {
            const response = await userService.getAll();
            setUsers(response);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Xác nhận xóa người dùng?")) {
            try {
                const response = await userService.remove(id);
            }
            catch (error) {
                alert("Lỗi xóa người dùng");
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-tl from-sky-50 via-white to-sky-500 px-6 py-8"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center justify-between"
                >
                    <h1 className="text-3xl font-bold text-[#00278D] mb-6 p-2 bg-white rounded-xl shadow-xl">Danh sách người dùng</h1>
                    <button onClick={() => navigate("/admin/add-user")} className="flex items-center text-sm mb-6 bg-sky-500 text-white p-2 rounded-xl hover:shadow-xl hover:bg-sky-700 transition duration-300 cursor-pointer"> <IoMdPersonAdd />Thêm người dùng</button>
                </motion.div>

                {/* Thanh tìm kiếm */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <FiSearch className="text-[#00278D]" size={20} />
                        <h2 className="text-lg font-semibold text-[#00278D]">Tìm kiếm người dùng</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tên người dùng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên người dùng
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={searchParams.fullName}
                                onChange={handleSearchChange}
                                placeholder="Nhập tên người dùng..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                value={searchParams.email}
                                onChange={handleSearchChange}
                                placeholder="Nhập email..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>

                        {/* Vai trò */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vai trò
                            </label>
                            <select
                                name="role"
                                value={searchParams.role}
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            >
                                <option value="">Tất cả vai trò</option>
                                <option value="ADMIN">Admin</option>
                                <option value="DOCTOR">Bác sĩ</option>
                                <option value="PATIENT">Bệnh nhân</option>
                                <option value="STAFF">Nhân viên</option>
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleSearch}
                            className="bg-[#00278D] text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <FiSearch size={16} />
                            Tìm kiếm
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                        >
                            Đặt lại
                        </button>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden"
                >
                    <table className="min-w-full text-sm">
                        <thead className="bg-sky-50 text-[#00278D]">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold">STT</th>
                                <th className="px-6 py-3 text-left font-semibold">Email</th>
                                <th className="px-6 py-3 text-left font-semibold">Họ tên</th>
                                <th className="px-6 py-3 text-left font-semibold">Vai trò</th>
                                <th className="px-6 py-3 text-center font-semibold">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                                        Đang tải danh sách người dùng...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                                        Không có người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u, idx) => (
                                    <tr
                                        key={u.id ?? idx}
                                        className={`hover:bg-sky-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                                            }`}
                                    >
                                        <td className="px-6 py-3 text-slate-800">{idx + 1}</td>
                                        <td className="px-6 py-3 text-slate-700">{u.email}</td>
                                        <td className="px-6 py-3 text-slate-700">{u.fullName || "—"}</td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "ADMIN"
                                                    ? "bg-red-50 text-red-600"
                                                    : u.role === "DOCTOR" || u.role === "STAFF"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-sky-50 text-[#00278D]"
                                                    }`}
                                            >
                                                {u.role || "USER"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/show-user/${u.id}`)}
                                                className="px-3 py-1.5 rounded-xl border border-sky-300 border-2 cursor-pointer text-[#00278D] hover:bg-sky-50 flex items-center gap-1 text-xs transition"
                                            >
                                                <FiEye size={14} /> Xem
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/edit-user/${u.id}`)}
                                                className="px-3 py-1.5 rounded-xl border border-emerald-300 border-2 cursor-pointer text-emerald-600 hover:bg-emerald-50 flex items-center gap-1 text-xs transition"
                                            >
                                                <FiEdit2 size={14} /> Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="px-3 py-1.5 rounded-xl border border-red-300 border-2 cursor-pointer text-red-500 hover:bg-red-50 flex items-center gap-1 text-xs transition"
                                            >
                                                <FiTrash2 size={14} /> Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default AdminUserManagement;