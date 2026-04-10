import { useState } from "react";import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../api/services";

export default function Login() {
    const [role, setRole] = useState("user");
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { 
                email: form.email, 
                password: form.password 
            }
            const res = await authService.login(data);
            
            console.log("Login OK:", res);
            const serverRole = res.roles[0].toLowerCase();
            const selectedRole = role.toLowerCase();    

            if (serverRole !== selectedRole) {
                alert("Tài khoản không đúng vai trò đã chọn!");
                return;
            }

            // Lưu token và điều hướng
            localStorage.setItem("auth", JSON.stringify(res));
            navigate("/");
        }
        catch (err) {
            console.error("Login FAIL:", err.message);
            alert(err.message);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-tl from-sky-50 via-white to-sky-500" >
            <div className="bg-white p-10 rounded-3xl shadow-2xl/100 shadow-sky-800 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                    <span className="text-[#00278D]">Đăng nhập A<sup className="text-[#FEB802]">*</sup></span>
                    <span className="text-sky-500">Care</span>
                </h1>

                {/* --- chọn vai trò --- */}
                <div className="flex justify-center mb-6 gap-4">
                    <button
                        onClick={() => setRole("user")}
                        className={`px-5 py-2 rounded-full transition ${role === "user"
                            ? "bg-sky-500 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        Người dùng
                    </button>
                    <button
                        onClick={() => setRole("admin")}
                        className={`px-5 py-2 rounded-full transition ${role === "admin"
                            ? "bg-sky-500 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        Quản trị viên
                    </button>
                </div>

                {/* --- form đăng nhập --- */}
                <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div>
                        <label className="block text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-sky-500 hover:bg-sky-500 mt-5 text-white font-semibold py-2.5 rounded-lg transition"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="text-center text-slate-500 mt-6 text-md font-bold">
                    {role === "user"
                        ? <div>Bạn chưa có tài khoản? <NavLink to={"/register"} className="hover:text-sky-500">Đăng ký.</NavLink></div>
                        : "Chỉ dành cho quản trị viên hệ thống."}
                </div>
            </div>
        </section>
    );
}
