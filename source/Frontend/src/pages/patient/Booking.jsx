import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowRight, FiCalendar, FiChevronDown, FiChevronUp, FiMapPin, FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { appointmentService, serviceService } from "../../api";
import { getCurrentUser, isLoggedIn } from "../../utils/authUtils";
import CustomDropdown from "../../components/CustomDropdown";
import ActionModal from "../../components/ActionModal";
import { animatePageEnter } from "../../utils/animeAnimations";

const toLocalIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function Booking() {
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const pageRef = useRef(null);
    
    const [doctors, setDoctors] = useState([]);
    const [doctorSlots, setDoctorSlots] = useState({});
    const [loadingSlotsId, setLoadingSlotsId] = useState(null);
    
    const [doctorDates, setDoctorDates] = useState({}); 
    
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [reason, setReason] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COUNTER");
    const [noticeModal, setNoticeModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        tone: "info",
    });
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const currentUser = useMemo(() => getCurrentUser(), []);
    const patientId = currentUser?.id || "";
    const navigate = useNavigate();
    const location = useLocation();

    const weekdayOptions = useMemo(() => {
        const result = [];
        const cursor = new Date();
        const todayIso = toLocalIsoDate(new Date());

        while (result.length < 10) {
            const day = cursor.getDay();
            const isWeekend = day === 0 || day === 6;
            if (!isWeekend) {
                const dd = String(cursor.getDate()).padStart(2, "0");
                const mm = String(cursor.getMonth() + 1).padStart(2, "0");
                const value = toLocalIsoDate(cursor);
                const label = value === todayIso ? `Hôm nay - ${dd}/${mm}` : `Thứ ${day + 1} - ${dd}/${mm}`;
                result.push({ label, value, weekdayName: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][day] });
            }
            cursor.setDate(cursor.getDate() + 1);
        }

        return result;
    }, []);

    const getDoctorAllowedWorkingDays = (doctor) => {
        const rawDays = String(doctor?.workingDays || "");
        const parsed = rawDays
            .split(",")
            .map((item) => item.trim().toUpperCase())
            .filter(Boolean)
            .filter((item) => ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].includes(item));
        return new Set(parsed.length ? parsed : ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);
    };

    const getDateOptionsForDoctor = (doctor) => {
        const allowedDays = getDoctorAllowedWorkingDays(doctor);
        return weekdayOptions.filter((option) => allowedDays.has(option.weekdayName));
    };

    useEffect(() => {
        const animation = animatePageEnter(pageRef.current);
        return () => {
            animation?.pause?.();
        };
    }, []);

    const showNoticeModal = (payload) => {
        setNoticeModal({
            isOpen: true,
            title: payload?.title || "Thông báo",
            message: payload?.message || "",
            tone: payload?.tone || "info",
        });
    };

    useEffect(() => {
        const bookingResult = location.state?.bookingResult;
        const preselectedServiceId = location.state?.preselectedServiceId;
        const openGuide = new URLSearchParams(location.search).get("guide") === "1";

        if (openGuide) {
            setIsGuideOpen(true);
        }

        let shouldResetState = false;

        if (bookingResult?.message) {
            const tone = bookingResult.type === "success" ? "success" : bookingResult.type === "warning" ? "warning" : "info";
            showNoticeModal({
                title: bookingResult.type === "success" ? "Thành công" : bookingResult.type === "warning" ? "Lưu ý" : "Thông báo",
                message: bookingResult.message,
                tone,
            });
            shouldResetState = true;
        }

        if (preselectedServiceId) {
            setSelectedServiceId(String(preselectedServiceId));
            shouldResetState = true;
        }

        if (shouldResetState) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.pathname, location.state, navigate]);

    // Load active services
    useEffect(() => {
        const fetchServices = async () => {
            const data = await serviceService.getAll();
            const activeOnly = Array.isArray(data) ? data.filter(s => s?.active !== false) : [];
            setServices(activeOnly);
        };
        fetchServices();
    }, []);

    // Load doctors when a service is selected
    useEffect(() => {
        setSelectedDoctorId("");
        setSelectedTime("");
        setDoctorSlots({});
        setDoctorDates({});
        setReason("");
        setPaymentMethod("COUNTER");
        
        const fetchDoctors = async () => {
            if (!selectedServiceId) {
                setDoctors([]);
                return;
            }
            try {
                const data = await appointmentService.getDoctorsByService(selectedServiceId);
                setDoctors(data || []);

                // Set each doctor default date to the nearest allowed weekday in the future.
                const today = toLocalIsoDate(new Date());
                const initialDates = {};
                (data || []).forEach(doc => {
                    const options = getDateOptionsForDoctor(doc);
                    initialDates[doc.id] = options[0]?.value || today;
                });
                setDoctorDates(initialDates);
                
            } catch (err) {
                console.error("Error loading doctors", err);
                setDoctors([]);
            }
        };
        fetchDoctors();
    }, [selectedServiceId]);

    // Lấy slots cho 1 bác sĩ nhất định khi đổi ngày
    const fetchSlotsForDoctor = async (doctorId, date) => {
        if (!selectedServiceId || !doctorId || !date) return;
        
        setLoadingSlotsId(doctorId);
        try {
            const data = await appointmentService.getDoctorAvailability(doctorId, selectedServiceId, date);
            setDoctorSlots(prev => ({
                ...prev,
                [doctorId]: Array.isArray(data) ? data : []
            }));
        } catch (err) {
            console.error("Error loading slots for doctor", err);
            setDoctorSlots(prev => ({...prev, [doctorId]: []}));
        } finally {
            setLoadingSlotsId(null);
        }
    };

    // Khi khởi tạo doctors, load slots cho ngày mặc định
    useEffect(() => {
        doctors.forEach(doc => {
            if (doctorDates[doc.id]) {
                fetchSlotsForDoctor(doc.id, doctorDates[doc.id]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doctors]); // Chỉ chạy khi danh sách bác sĩ thay đổi (load lần đầu)

    // Handle date change for a specific doctor
    const handleDateChange = (doctorId, newDate) => {
        setDoctorDates(prev => ({ ...prev, [doctorId]: newDate }));
        // Khi đổi ngày, reset lựa chọn nếu đang chọn bác sĩ này
        if (selectedDoctorId === doctorId) {
            setSelectedTime("");
        }
        fetchSlotsForDoctor(doctorId, newDate);
    };

    const serviceOptions = useMemo(() => {
        return services.map((service) => ({
            value: String(service.id),
            label: `${service.name} - ${service.price?.toLocaleString("vi-VN")} VND`,
        }));
    }, [services]);

    // Xử lý click chọn khung giờ
    const handleSelectSlot = (doctorId, time) => {
        setSelectedDoctorId(doctorId);
        setSelectedTime(time);
        setReason("");
    };

    // Xử lý Đặt lịch
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLoggedIn() || !patientId) {
            showNoticeModal({
                title: "Không thể đặt lịch",
                message: "Vui lòng đăng nhập bằng tài khoản bệnh nhân để đặt lịch.",
                tone: "warning",
            });
            return;
        }

        if (!selectedServiceId || !selectedDoctorId || !selectedTime) {
            showNoticeModal({
                title: "Thiếu thông tin",
                message: "Vui lòng chọn đầy đủ thông tin.",
                tone: "warning",
            });
            return;
        }

        const date = doctorDates[selectedDoctorId];

        const selectedDoctor = doctors.find((doc) => String(doc.id) === String(selectedDoctorId));
        const selectedService = services.find((service) => String(service.id) === String(selectedServiceId));

        if (!date || !selectedDoctor || !selectedService) {
            showNoticeModal({
                title: "Thiếu dữ liệu",
                message: "Thiếu dữ liệu hóa đơn, vui lòng chọn lại thông tin đặt khám.",
                tone: "warning",
            });
            return;
        }

        const startTime = `${date}T${selectedTime}`;
        try {
            await appointmentService.bookForPatient({
                patientId,
                doctorId: Number(selectedDoctorId),
                startTime,
                serviceId: Number(selectedServiceId),
                reason,
                paymentMethod,
            });
            window.location.assign("/patient/appointments");
        } catch (error) {
            showNoticeModal({
                title: "Đặt lịch thất bại",
                message: error?.message || "Không thể đặt lịch. Vui lòng thử lại.",
                tone: "warning",
            });
        }
    };

    const closeNoticeModal = () => {
        setNoticeModal((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <div ref={pageRef} className="bg-slate-50 min-h-screen pb-16">
            <header className="bg-white shadow py-6 mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-[#00278D]">Đặt lịch khám bệnh</h1>
                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                    Chọn dịch vụ, xem hồ sơ bác sĩ và chọn giờ khám phù hợp với bạn.
                </p>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => setIsGuideOpen((prev) => !prev)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#00278D] px-4 py-2 font-semibold text-[#00278D] hover:bg-[#00278D]/5 transition"
                    >
                        {isGuideOpen ? <FiChevronUp /> : <FiChevronDown />}
                        {isGuideOpen ? "Ẩn hướng dẫn đặt khám" : "Xem hướng dẫn đặt khám"}
                    </button>
                </div>
                <div className="h-1 w-32 bg-[#00278D] rounded-full mx-auto mt-4"></div>
            </header>

            <main className="max-w-5xl mx-auto px-4 space-y-6">
                {isGuideOpen ? (
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-[#00278D] mb-4">Hướng dẫn đặt lịch khám</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="font-semibold mb-1">Bước 1</p>
                                <p>Chọn dịch vụ khám phù hợp với nhu cầu.</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="font-semibold mb-1">Bước 2</p>
                                <p>Chọn bác sĩ và ngày khám mong muốn.</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="font-semibold mb-1">Bước 3</p>
                                <p>Chọn khung giờ còn trống và điền lý do khám (nếu có).</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="font-semibold mb-1">Bước 4</p>
                                <p>Nhấn xác nhận để lưu lịch hẹn. Thanh toán thực hiện tại quầy khi đến khám.</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">Mẹo: nếu bác sĩ đã kín lịch, hãy đổi sang ngày khác trong danh sách.</p>
                    </section>
                ) : null}

                {/* 1. Chọn dịch vụ */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="bg-[#00278D] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                        Chọn chuyên khoa / Dịch vụ
                    </h2>
                    <CustomDropdown
                        value={selectedServiceId}
                        onValueChange={setSelectedServiceId}
                        options={serviceOptions}
                        placeholder="-- Vui lòng chọn dịch vụ --"
                        buttonClassName="text-base border-2 border-slate-300 py-3"
                    />
                </section>

                {/* 2. Danh sách bác sĩ */}
                {selectedServiceId && (
                    <section className="space-y-6">
                        {doctors.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-sm text-center text-slate-600 border border-slate-200">
                                <FiUser className="mx-auto mb-4 text-4xl text-slate-500" />
                                <p className="font-medium text-lg">Hiện chưa có bác sĩ nào cho dịch vụ này.</p>
                                <p className="text-sm mt-1">Vui lòng chọn dịch vụ khác hoặc quay lại sau.</p>
                            </div>
                        ) : (
                            doctors.map((doc) => {
                                const doctorSlotsArr = doctorSlots[doc.id] || [];
                                const isLoading = loadingSlotsId === doc.id;
                                const isSelectedDoctor = selectedDoctorId === doc.id;
                                const currentDoctorDate = doctorDates[doc.id] || '';
                                const doctorDateOptions = getDateOptionsForDoctor(doc);

                                return (
                                    <div key={doc.id} className={`bg-white rounded-xl shadow-md border-2 transition-all overflow-hidden ${isSelectedDoctor && selectedTime ? 'border-[#001f5f] ring-2 ring-[#001f5f]/20' : 'border-slate-200'}`}>
                                        <div className="flex flex-col lg:flex-row">
                                            
                                            {/* LEFT: Doctor Info */}
                                            <div className="lg:w-5/12 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex sm:flex-row flex-col gap-4 items-center sm:items-start text-center sm:text-left bg-slate-50">
                                                <div className="w-24 h-24 flex-shrink-0 bg-white text-[#00278D] rounded-full shadow-inner flex items-center justify-center border-2 border-slate-200">
                                                    <FiUser className="h-12 w-12" />
                                                </div>
                                                <div>
                                                    <div className="text-[#00278D] font-bold text-sm mb-1 uppercase tracking-wide">Bác sĩ Chuyên khoa</div>
                                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{doc.fullName}</h3>
                                                    <p className="text-sm text-slate-600 line-clamp-3 mb-2">
                                                        {doc.biography || "Bác sĩ giàu kinh nghiệm, tận tâm với nghề."}
                                                    </p>
                                                    <div className="pt-2 border-t border-slate-200">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 flex items-center gap-1">
                                                            <FiMapPin className="text-slate-500" />
                                                            Địa chỉ khám
                                                        </p>
                                                        <p className="text-sm font-semibold text-slate-700">{doc.clinicLocation || "Đang cập nhật"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT: Booking Flow (Date -> Slots) */}
                                            <div className="lg:w-7/12 p-6">
                                                
                                                {/* Date Selector */}
                                                <div className="mb-4 w-full sm:w-56">
                                                    <CustomDropdown
                                                        value={currentDoctorDate}
                                                        onValueChange={(value) => handleDateChange(doc.id, value)}
                                                        options={doctorDateOptions.map((date) => ({
                                                            value: date.value,
                                                            label: date.label,
                                                        }))}
                                                        buttonClassName="bg-slate-50 border-slate-300 py-2"
                                                    />
                                                </div>

                                                {/* Slots Layout */}
                                                <div className="mt-2">
                                                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                                        <FiCalendar className="text-base" /> LỊCH KHÁM
                                                    </h4>
                                                    
                                                    {isLoading ? (
                                                        <div className="animate-pulse flex gap-2">
                                                            <div className="h-10 w-24 bg-slate-200 rounded-md"></div>
                                                            <div className="h-10 w-24 bg-slate-200 rounded-md"></div>
                                                            <div className="h-10 w-24 bg-slate-200 rounded-md"></div>
                                                        </div>
                                                    ) : doctorSlotsArr.length === 0 ? (
                                                        <p className="text-sm text-slate-700 bg-slate-100 rounded-lg p-3 font-medium border border-slate-200 italic">
                                                            Bác sĩ đã kín lịch vào ngày này. Vui lòng chọn ngày khác.
                                                        </p>
                                                    ) : (
                                                        <>
                                                            <div className="flex flex-wrap gap-3">
                                                                {doctorSlotsArr.map((slot) => {
                                                                    const slotTimeLabel = slot.time.slice(0, 5);
                                                                    const slotDateTime = currentDoctorDate
                                                                        ? new Date(`${currentDoctorDate}T${slotTimeLabel}`)
                                                                        : null;
                                                                    const isPastSlot = slotDateTime ? slotDateTime.getTime() < Date.now() : false;
                                                                    const disabled = !slot.available || isPastSlot;
                                                                    const isThisSlotSelected = isSelectedDoctor && selectedTime === slot.time;
                                                                    
                                                                    let btnClass = "w-28 py-2 text-sm font-bold rounded-lg border transition-all shadow-sm text-center ";
                                                                    if (disabled) {
                                                                        btnClass += "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-80";
                                                                    } else if (isThisSlotSelected) {
                                                                        btnClass += "bg-[#001f5f] text-white border-[#001f5f] ring-2 ring-[#001f5f]/20 ring-offset-1 transform scale-105 shadow-md";
                                                                    } else {
                                                                        btnClass += "bg-white text-slate-800 border-slate-300 hover:border-[#001f5f] hover:text-[#001f5f] hover:bg-slate-50";
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={slot.time}
                                                                            type="button"
                                                                            disabled={disabled}
                                                                            onClick={() => handleSelectSlot(doc.id, slot.time)}
                                                                            className={btnClass}
                                                                        >
                                                                            {slotTimeLabel}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-3 font-medium flex items-center gap-1">
                                                                <FiArrowRight /> Chọn và đặt (Giữ chỗ 0đ)
                                                            </p>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Booking Confirmation Form - Chỉ hiện cho Bác sĩ ĐANG CHỌN */}
                                                {isSelectedDoctor && selectedTime ? (
                                                    <div className="overflow-hidden bg-slate-50 p-5 rounded-xl border border-slate-200 mt-6">
                                                        <h5 className="font-bold text-[#001f5f] mb-3 border-b border-slate-200 pb-2">Xác nhận thông tin</h5>
                                                        <div className="mb-4">
                                                            <label className="block text-slate-700 font-medium mb-1 text-sm">Triệu chứng / Lý do khám (Tùy chọn)</label>
                                                            <textarea
                                                                value={reason}
                                                                onChange={(e) => setReason(e.target.value)}
                                                                rows="2"
                                                                placeholder="Mô tả triệu chứng để bác sĩ chuẩn bị tốt hơn..."
                                                                className="w-full border border-slate-300 p-2 text-sm rounded-md focus:outline-none focus:border-[#001f5f] focus:ring-1 focus:ring-[#001f5f] bg-white"
                                                            />
                                                        </div>
                                                        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3">
                                                            <p className="text-slate-700 font-medium mb-2 text-sm">Phương thức thanh toán</p>
                                                            <label className="flex items-center gap-2 text-sm text-slate-800">
                                                                <input
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    value="COUNTER"
                                                                    checked={paymentMethod === "COUNTER"}
                                                                    onChange={(event) => setPaymentMethod(event.target.value)}
                                                                    className="h-4 w-4"
                                                                />
                                                                Thanh toán tại quầy
                                                            </label>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                                            <div className="text-sm space-y-1">
                                                                Giờ chọn: <strong className="text-lg text-[#001f5f]">{selectedTime.slice(0, 5)}</strong> - {currentDoctorDate.split('-').reverse().join('/')}
                                                                <div>Phòng khám: <strong>{doc.clinicLocation || "Đang cập nhật"}</strong></div>
                                                            </div>
                                                            <button
                                                                onClick={handleSubmit}
                                                                className="w-full sm:w-auto bg-[#00278D] hover:bg-[#001f5f] text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-md active:transform active:scale-95"
                                                            >
                                                                Xác nhận Đặt khám
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </section>
                )}
            </main>

            <ActionModal
                isOpen={noticeModal.isOpen}
                title={noticeModal.title}
                message={noticeModal.message}
                tone={noticeModal.tone}
                confirmText="Đã hiểu"
                onConfirm={closeNoticeModal}
                onClose={closeNoticeModal}
            />
        </div>
    );
}