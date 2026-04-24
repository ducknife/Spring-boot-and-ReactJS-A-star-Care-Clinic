import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { specialtyService, userService } from "../../../api";
import CustomDropdown from "../../../components/CustomDropdown";
import ActionModal from "../../../components/ActionModal";
import { animatePageEnter } from "../../../utils/animeAnimations";

const ymdToDmy = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const dmyMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmyMatch) {
        const [, d, m, y] = dmyMatch;
        return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
    }

    const ymdMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (!ymdMatch) return "";

    const [, y, m, d] = ymdMatch;
    return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};

const USER_CREATE_MESSAGE_MAP = {
    "SIGN UP SUCCESSFULLY": "Đăng ký thành công",
    "EMAIL WAS USED": "Email đã có trong CSDL",
    "NUMBER WAS USED": "Số điện thoại đã có trong CSDL",
    "ID NUMBER WAS USED": "CCCD/CMND đã có trong CSDL",
    "PASSWORD MISMATCH": "Mật khẩu xác nhận không khớp",
    "DOCTOR SPECIALTY IS REQUIRED": "Bác sĩ phải có chuyên môn/chuyên khoa",
    "DOCTOR CLINIC LOCATION IS REQUIRED": "Bác sĩ phải có phòng khám",
    "DOCTOR YEARS EXPERIENCE IS REQUIRED": "Bác sĩ phải có số năm kinh nghiệm",
};

const mapCreateMessage = (message) => {
    if (!message) return "Đã xảy ra lỗi, vui lòng thử lại.";
    return USER_CREATE_MESSAGE_MAP[message] || message;
};

function AddUser() {

    const navigate = useNavigate();
    const pageRef = useRef(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "PATIENT",
        specialtyId: "",
        clinicLocation: "",
        yearsExperience: 0,
        gender: "OTHER",
        birthDate: "",
        address: "",
        idNumber: "",
        workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
        shiftStart: "08:00",
        shiftEnd: "17:00",
    });

    const [specialties, setSpecialties] = useState([]);
    const [specialtiesError, setSpecialtiesError] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);
    const [resultModal, setResultModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        tone: "info",
        nextAction: "none",
    });

    useEffect(() => {
        const animation = animatePageEnter(pageRef.current);
        return () => {
            animation?.pause?.();
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const data = await specialtyService.getAll();
                setSpecialties(Array.isArray(data) ? data : []);
            }
            catch (err) {
                setSpecialtiesError(err?.message || "Không tải được danh sách chuyên khoa");
            }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const next = { ...form, [name]: value };
        if (name === "role" && value !== "DOCTOR") {
            next.specialtyId = "";
            next.clinicLocation = "";
            next.yearsExperience = 0;
        }
        setForm(next);
    };

    const handleWorkingDaysChange = (e) => {
        const value = e.target.value;
        setForm(prev => {
            const current = [...prev.workingDays];
            if (e.target.checked && !current.includes(value)) current.push(value);
            else if (!e.target.checked) {
                const idx = current.indexOf(value);
                if (idx > -1) current.splice(idx, 1);
            }
            return { ...prev, workingDays: current };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setResultModal({
                isOpen: true,
                title: "Không thể tạo người dùng",
                message: mapCreateMessage("PASSWORD MISMATCH"),
                tone: "warning",
                nextAction: "none",
            });
            return;
        }

        if (form.role === "DOCTOR" && !form.specialtyId) {
            setResultModal({
                isOpen: true,
                title: "Không thể tạo người dùng",
                message: mapCreateMessage("DOCTOR SPECIALTY IS REQUIRED"),
                tone: "warning",
                nextAction: "none",
            });
            return;
        }

        if (form.role === "DOCTOR" && !form.clinicLocation.trim()) {
            setResultModal({
                isOpen: true,
                title: "Không thể tạo người dùng",
                message: mapCreateMessage("DOCTOR CLINIC LOCATION IS REQUIRED"),
                tone: "warning",
                nextAction: "none",
            });
            return;
        }

        if (form.role === "DOCTOR" && Number(form.yearsExperience) < 0) {
            setResultModal({
                isOpen: true,
                title: "Không thể tạo người dùng",
                message: mapCreateMessage("DOCTOR YEARS EXPERIENCE IS REQUIRED"),
                tone: "warning",
                nextAction: "none",
            });
            return;
        }

        const payload = {
            ...form,
            specialtyId: form.role === "DOCTOR" ? Number(form.specialtyId) : undefined,
            clinicLocation: form.role === "DOCTOR" ? form.clinicLocation.trim() : undefined,
            yearsExperience: form.role === "DOCTOR" ? Number(form.yearsExperience || 0) : undefined,
            birthDate: ymdToDmy(form.birthDate),
            workingDays: form.workingDays.join(","),
        };

        setPendingPayload(payload);
        setConfirmOpen(true);
    };

    const handleConfirmCreate = async () => {
        if (!pendingPayload) return;

        setCreating(true);
        try {
            const data = await userService.create(pendingPayload);
            const isSuccess = data?.success !== false;
            const mappedMessage = mapCreateMessage(data?.message || "SIGN UP SUCCESSFULLY");

            setConfirmOpen(false);
            setResultModal({
                isOpen: true,
                title: isSuccess ? "Tạo thành công" : "Tạo thất bại",
                message: mappedMessage,
                tone: isSuccess ? "success" : "warning",
                nextAction: isSuccess ? "back-users" : "none",
            });
        }
        catch (err) {
            setConfirmOpen(false);
            setResultModal({
                isOpen: true,
                title: "Tạo thất bại",
                message: mapCreateMessage(err?.message),
                tone: "warning",
                nextAction: "none",
            });
        }
        finally {
            setCreating(false);
            setPendingPayload(null);
        }
    };

    const closeConfirmModal = () => {
        if (creating) return;
        setConfirmOpen(false);
        setPendingPayload(null);
    };

    const closeResultModal = () => {
        const { nextAction } = resultModal;
        setResultModal((prev) => ({ ...prev, isOpen: false, nextAction: "none" }));

        if (nextAction === "back-users") {
            window.location.assign("/admin/users");
        }
    };

    return (
        <section ref={pageRef} className="flex min-h-screen items-center justify-center bg-[var(--surface)]">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-[50vw]">
                <h1 className="text-3xl font-bold text-center text-[#00278D] mb-6">
                    Thêm người dùng A-Care
                </h1>

                {/* --- form đăng kí --- */}
                <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-x-5">
                    <div>
                        <label className="block text-slate-600 mb-1">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Nhập Họ và tên..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
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
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
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
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu..."
                            className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Vai trò</label>
                        <CustomDropdown
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            options={[
                                { value: "PATIENT", label: "Bệnh nhân" },
                                { value: "DOCTOR", label: "Bác sĩ" },
                                { value: "ADMIN", label: "Quản trị viên" },
                            ]}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 mb-1">Giới tính</label>
                        <CustomDropdown
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            options={[
                                { value: "MALE", label: "Nam" },
                                { value: "FEMALE", label: "Nữ" },
                                { value: "OTHER", label: "Khác" },
                            ]}
                            placeholder="-- Chọn giới tính --"
                            required
                        />
                    </div>
                    {form.role === "DOCTOR" && (
                        <>
                            <div>
                                <label className="block text-slate-600 mb-1">Chuyên khoa</label>
                                <CustomDropdown
                                    name="specialtyId"
                                    value={form.specialtyId}
                                    onChange={handleChange}
                                    options={specialties.map((specialty) => ({
                                        value: String(specialty.id),
                                        label: `${specialty.name} (${specialty.code})`,
                                    }))}
                                    placeholder="-- Chọn chuyên khoa --"
                                    required
                                />
                                {specialtiesError && <p className="mt-1 text-sm text-slate-700">{specialtiesError}</p>}
                            </div>
                            <div>
                                <label className="block text-slate-600 mb-1">Số năm kinh nghiệm</label>
                                <input
                                    type="number"
                                    name="yearsExperience"
                                    min="0"
                                    step="1"
                                    value={form.yearsExperience}
                                    onChange={handleChange}
                                    placeholder="Nhập số năm kinh nghiệm..."
                                    className="w-full px-4 py-2 transition duration-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 mb-1">Phòng khám của bác sĩ</label>
                                <input
                                    type="text"
                                    name="clinicLocation"
                                    value={form.clinicLocation}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: Tòa A - Phòng 301"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
                                    required
                                />
                            </div>
                        </>
                    )}
                    {form.role === "DOCTOR" && (
                        <div className="col-span-2 grid grid-cols-2 gap-x-5">
                            <div className="col-span-2">
                                <label className="block text-slate-600 mb-1">Ngày làm việc</label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { val: "MONDAY", label: "T2" }, { val: "TUESDAY", label: "T3" },
                                        { val: "WEDNESDAY", label: "T4" }, { val: "THURSDAY", label: "T5" },
                                        { val: "FRIDAY", label: "T6" }
                                    ].map(day => (
                                        <label key={day.val} className="flex items-center space-x-2 text-slate-600">
                                            <input type="checkbox" value={day.val} checked={form.workingDays.includes(day.val)} onChange={handleWorkingDaysChange} className="rounded text-[#00278D] focus:ring-[#00278D]" />
                                            <span>{day.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-slate-600 mb-1 mt-3">Giờ bắt đầu</label>
                                <input type="time" name="shiftStart" value={form.shiftStart} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none" required />
                            </div>
                            <div>
                                <label className="block text-slate-600 mb-1 mt-3">Giờ kết thúc</label>
                                <input type="time" name="shiftEnd" value={form.shiftEnd} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none" required />
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-slate-600 mb-1">Ngày sinh</label>
                        <input
                            type="date"
                            name="birthDate"
                            value={form.birthDate}
                            onChange={handleChange}
                            placeholder="Nhập ngày sinh... ví dụ: 07/01/2005"
                            className="w-full px-4 text-slate-500 transition duration-200 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
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
                            className="w-full px-4 py-2 border border-slate-300 transition duration-200 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
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
                            className="w-full px-4 py-2 border border-slate-300 transition duration-200 rounded-lg focus:ring-2 focus:ring-[#00278D] outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-10 cursor-pointer bg-[#00278D] mt-5 hover:bg-[#001f5f] text-white font-semibold py-2.5 rounded-lg transition"
                    >
                        Thêm người dùng
                    </button>
                    <button
                        onClick={() => navigate("/admin/users")}
                        type="button"
                        className="w-full h-10 cursor-pointer bg-slate-800 mt-5 hover:bg-slate-900 text-white font-semibold py-2.5 rounded-lg transition"
                    >
                        Quay lại
                    </button>
                </form>
            </div>

            <ActionModal
                isOpen={confirmOpen}
                title="Xác nhận tạo người dùng"
                message="Người dùng mới sẽ được lưu vào hệ thống ngay sau khi xác nhận."
                tone="warning"
                confirmText="Tạo người dùng"
                cancelText="Hủy"
                showCancel
                loading={creating}
                onConfirm={handleConfirmCreate}
                onClose={closeConfirmModal}
                closeOnBackdrop={!creating}
            />

            <ActionModal
                isOpen={resultModal.isOpen}
                title={resultModal.title}
                message={resultModal.message}
                tone={resultModal.tone}
                confirmText="Đã hiểu"
                onConfirm={closeResultModal}
                onClose={closeResultModal}
            />
        </section>
    );
}

export default AddUser;