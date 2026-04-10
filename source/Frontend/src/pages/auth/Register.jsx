import { useEffect, useState } from "react";import { NavLink, useNavigate } from "react-router-dom";
import { userService } from "../../api/services";

const ymdToDmy = (ymd) => {
    if (!ymd) return "";
    const [y, m, d] = ymd.split("-");
    return `${d}/${m}/${y}`;
};


function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        passwordHash: "",
        role: "PATIENT",
        gender: "OTHER",
        birthDate: "",
        address: "",
        idNumber: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                birthDate: ymdToDmy(form.birthDate),
            };
            const data = await userService.create(payload);
            setMessage(data.message);
            if (data.success) navigate("/login");
        }
        catch (err) {
            console.error(err.message);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-tl from-sky-50 via-white to-sky-500" >
            <div className="bg-white p-10 rounded-3xl shadow-2xl/100 shadow-sky-800 w-[50vw]">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                    <span className="text-[#00278D]">Đăng ký A<sup className="text-[#FEB802]">*</sup></span>
                    <span className="text-sky-500">Care</span>
                </h1>

                {/* --- form đăng kí --- */}
                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col md:grid md:grid-cols-2 gap-x-5">
                    <div>
                        <label className="block text-slate-600 mb-1">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Nhập Họ và tên..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Email</label>
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
                        <label className="block text-slate-600 mb-1">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Nhập SĐT..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            name="passwordHash"
                            value={form.passwordHash}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Giới tính</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-md
                                    focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                                    transition duration-200 text-slate-500"
                            required
                        >
                            <option value="" disabled>-- Chọn giới tính --</option>
                            <option value={"MALE"}>Nam</option>
                            <option value={"FEMALE"}>Nữ</option>
                            <option value={"OTHER"}>Khác</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Ngày sinh</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={form.birthDate}
                            onChange={handleChange}
                            placeholder="Nhập ngày sinh... ví dụ: 07/01/2005"
                            className="w-full px-4 text-slate-500 transition duration-200 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Địa chỉ</label>
                        <input
                            type="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ..."
                            className="w-full px-4 py-2 border border-slate-300 transition duration-200 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">CCCD/CMND</label>
                        <input
                            type="text"
                            name="idNumber"
                            value={form.idNumber}
                            onChange={handleChange}
                            placeholder="Nhập CCCD..."
                            className="w-full px-4 py-2 border border-slate-300 transition duration-200 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-sky-500 mt-5 hover:bg-sky-500 text-white font-semibold py-2.5 rounded-lg transition"
                    >
                        Đăng ký
                    </button>
                    <div className="text-center flex justify-center items-center text-red-500 text-md font-bold">
                        Chỉ có thể đăng ký tài khoản bệnh nhân.
                    </div>
                    <div className="text-center flex justify-center items-center text-slate-500 text-md font-bold">
                        Đã có tài khoản? <NavLink to={"/login"} className="hover:text-sky-500 p-2"> Đăng nhập.</NavLink>
                    </div>
                    {message && <p className="mt-4 flex justify-center items-center text-sky-500">{message == "SIGN UP SUCCESSFULLY" ? "Đăng ký thành công" :
                        message == "EMAIL WAS USED" ? "Email đã được dùng" :
                            message == "NUMBER WAS USED" ? "Số điện thoại đã được dùng" :
                                message == "ID NUMBER WAS USED" ? "CCCD/CMND đã được dùng" : "LỖI"}</p>}
                </form>
            </div>
        </section>
    );
}

export default Register;