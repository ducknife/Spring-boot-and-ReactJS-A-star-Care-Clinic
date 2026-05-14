import { useEffect, useState } from "react";
import { getUserId } from "../../utils/authUtils";
import { activityService, appointmentService, serviceService, userService } from "../../api";
import { APPOINTMENT_CHANGED_EVENT } from "../../api/services/appointmentService";
import ActionModal from "../../components/ActionModal";

const cancelReasonOptions = [
    "Bác sĩ có lịch bận đột xuất",
    "Phòng khám không khả dụng",
    "Cần dời lịch do chuyên môn",
    "Lý do khác",
];

const formatDateTime = (value) => {
    if (!value) return "--/--/---- --:--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).replace("T", " ").slice(0, 16);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

function Schedule() {
    const id = getUserId();
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [appointments, setAppointments] = useState([]);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [patientMap, setPatientMap] = useState({});
    const [serviceMap, setServiceMap] = useState({});
    const [detailTarget, setDetailTarget] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [doneTarget, setDoneTarget] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [notices, setNotices] = useState([]);
    const [selectedCancelReason, setSelectedCancelReason] = useState(cancelReasonOptions[0]);
    const [customCancelReason, setCustomCancelReason] = useState("");
    const [cancelFormError, setCancelFormError] = useState("");

    useEffect(() => {
        const handleAppointmentChanged = () => {
            setCurrentPage(0);
            setRefreshKey((prev) => prev + 1);
        };

        window.addEventListener(APPOINTMENT_CHANGED_EVENT, handleAppointmentChanged);
        return () => window.removeEventListener(APPOINTMENT_CHANGED_EVENT, handleAppointmentChanged);
    }, []);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setTotalPages(0);
            return;
        }

        const fetchData = async () => {
            try {
                const [pageResponse, doctor, activityNotices] = await Promise.all([
                    appointmentService.pendingByDoctorIdPaged(id, {
                        page: currentPage,
                        size: 5,
                        sort: "startTime,asc",
                    }),
                    userService.getById(id),
                    activityService.getRecentByUser(id),
                ]);
                const normalized = Array.isArray(pageResponse?.content)
                    ? pageResponse.content.filter((item) => item?.status === "PENDING")
                    : [];
                setTotalPages(pageResponse?.totalPages || 0);

                setAppointments(normalized);
                setDoctorInfo(doctor || null);

                let resolvedNotices = Array.isArray(activityNotices) ? activityNotices : [];
                if (resolvedNotices.length === 0) {
                    try {
                        const recent = await activityService.getRecent();
                        const token = `[USER:${id}]`;
                        resolvedNotices = Array.isArray(recent)
                            ? recent.filter((item) => String(item?.message || "").includes(token))
                            : [];
                    } catch {
                        resolvedNotices = [];
                    }
                }
                setNotices(resolvedNotices);

                const patientIds = [...new Set(normalized.map((item) => item.patientId).filter(Boolean))];
                const serviceIds = [...new Set(normalized.map((item) => Number(item.serviceId ?? item.note)).filter((value) => !Number.isNaN(value)))];

                const [patients, services] = await Promise.all([
                    Promise.all(patientIds.map((patientId) => userService.getById(patientId))),
                    Promise.all(serviceIds.map((serviceId) => serviceService.getById(serviceId))),
                ]);

                setPatientMap(
                    patients.reduce((acc, patient) => {
                        if (patient?.id) acc[patient.id] = patient;
                        return acc;
                    }, {})
                );

                setServiceMap(
                    services.reduce((acc, service) => {
                        if (service?.id) acc[service.id] = service;
                        return acc;
                    }, {})
                );
            } catch (error) {
                console.error(error.message);
                setAppointments([]);
                setTotalPages(0);
                setNotices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, refreshKey, currentPage]);

    if (loading) {
        return <p className="py-10 text-center text-slate-500">Đang tải lịch hẹn...</p>;
    }

    return (
        <section className="bg-[var(--surface)] min-h-[40vh]">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
                <div className="bg-white w-fit h-fit p-3 rounded-2xl shadow-lg mb-6">
                    <h1 className="text-2xl font-bold text-[#00278D] sm:text-4xl">Lịch khám bác sĩ</h1>
                </div>

                {notices.length > 0 ? (
                    <div className="mb-5 rounded-xl border border-[#9AB8FF] bg-[#EAF1FF] p-4">
                        <p className="text-sm font-semibold text-[#00278D] mb-2">Thông báo mới</p>
                        <div className="space-y-1.5 text-sm text-[#00278D]">
                            {notices.slice(0, 4).map((notice) => (
                                <p key={notice.id}>• {String(notice.message || "").replace(/^\[USER:\d+\]\s*/, "")}</p>
                            ))}
                        </div>
                    </div>
                ) : null}

                {appointments.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {appointments.map((appointment) => {
                            const patient = patientMap[appointment.patientId] || {};
                            const serviceId = Number(appointment.serviceId ?? appointment.note);
                            const service = serviceMap[serviceId] || {};

                            return (
                                <div key={appointment.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <div className="md:col-span-4">
                                            <p className="text-xs uppercase tracking-wide text-slate-500">Bệnh nhân</p>
                                            <p className="text-base font-semibold text-slate-800">{patient.fullName || "Đang cập nhật"}</p>
                                        </div>
                                        <div className="md:col-span-3">
                                            <p className="text-xs uppercase tracking-wide text-slate-500">Dịch vụ</p>
                                            <p className="text-base font-semibold text-slate-800">{service.name || "Đang cập nhật"}</p>
                                        </div>
                                        <div className="md:col-span-3">
                                            <p className="text-xs uppercase tracking-wide text-slate-500">Thời gian khám</p>
                                            <p className="text-base font-semibold text-slate-800">{formatDateTime(appointment.startTime)}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <span className="inline-flex px-3 py-1 rounded-full text-sm border font-semibold bg-sky-100 text-sky-700 border-sky-300">
                                                Chưa khám
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setDetailTarget({ appointment, patient, service })}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 sm:w-auto"
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            type="button"
                                            disabled={processingId === appointment.id}
                                            onClick={() => setDoneTarget(appointment)}
                                            className="w-full rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
                                        >
                                            Khám xong
                                        </button>
                                        <button
                                            type="button"
                                            disabled={processingId === appointment.id}
                                            onClick={() => setCancelTarget(appointment)}
                                            className="w-full rounded-lg border border-rose-300 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-60 sm:w-auto"
                                        >
                                            Hủy lịch
                                        </button>
                                    </div>
                                </div>
                            );
                            })}
                        </div>

                        {totalPages > 1 ? (
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    type="button"
                                    disabled={currentPage === 0}
                                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setCurrentPage(index)}
                                        className={`rounded-md px-3 py-1.5 text-sm border ${currentPage === index
                                            ? "bg-[#00278D] text-white border-[#00278D]"
                                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages - 1}
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
                                >
                                    Sau
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <p className="text-xl text-[#00278D]">Không có lịch hẹn nào đang chờ.</p>
                )}

                {detailTarget ? (
                    <div className="fixed inset-0 z-[130] bg-black/40 p-4 flex items-center justify-center" onClick={() => setDetailTarget(null)}>
                        <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 sm:p-6" onClick={(event) => event.stopPropagation()}>
                            <h3 className="text-2xl font-bold text-[#00278D]">Chi tiết lịch hẹn</h3>
                            <p className="text-sm text-slate-500 mt-1">Mã lịch hẹn: #{detailTarget.appointment.id}</p>

                            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Tên bệnh nhân</p>
                                    <p className="font-semibold text-slate-800">{detailTarget.patient.fullName || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Số điện thoại bệnh nhân</p>
                                    <p className="font-semibold text-slate-800">{detailTarget.patient.phone || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Bác sĩ</p>
                                    <p className="font-semibold text-slate-800">{doctorInfo?.fullName || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Số điện thoại bác sĩ</p>
                                    <p className="font-semibold text-slate-800">{doctorInfo?.phone || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Dịch vụ</p>
                                    <p className="font-semibold text-slate-800">{detailTarget.service.name || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Thời gian khám</p>
                                    <p className="font-semibold text-slate-800">{formatDateTime(detailTarget.appointment.startTime)}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                                    <p className="text-slate-500 mb-1">Ghi chú</p>
                                    <p className="font-medium text-slate-700">{detailTarget.appointment.reason || detailTarget.appointment.note || "Không có"}</p>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-slate-600 font-medium">Tổng thanh toán</span>
                                <span className="text-2xl font-extrabold text-[#001f5f]">{Number(detailTarget.service.price || 0).toLocaleString("vi-VN")} VND</span>
                            </div>

                            <div className="mt-5 flex justify-end">
                                <button type="button" onClick={() => setDetailTarget(null)} className="w-full rounded-lg bg-[#00278D] px-5 py-2.5 text-white hover:bg-[#001f5f] sm:w-auto">
                                    Đã hiểu
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            {cancelTarget ? (
                <div className="fixed inset-0 z-[140] bg-black/40 p-4 flex items-center justify-center" onClick={() => !processingId && setCancelTarget(null)}>
                    <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6" onClick={(event) => event.stopPropagation()}>
                        <h3 className="text-xl font-bold text-[#00278D]">Xác nhận hủy lịch</h3>
                        <p className="text-sm text-slate-600 mt-2">Vui lòng chọn hoặc nhập lý do hủy để gửi cho bệnh nhân.</p>

                        <div className="mt-4 space-y-2">
                            {cancelReasonOptions.map((reason) => (
                                <label key={reason} className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="radio"
                                        name="doctor-cancel-reason"
                                        value={reason}
                                        checked={selectedCancelReason === reason}
                                        onChange={(event) => {
                                            setSelectedCancelReason(event.target.value);
                                            setCancelFormError("");
                                        }}
                                    />
                                    {reason}
                                </label>
                            ))}
                        </div>

                        {selectedCancelReason === "Lý do khác" ? (
                            <div className="mt-3">
                                <textarea
                                    rows={3}
                                    value={customCancelReason}
                                    onChange={(event) => {
                                        setCustomCancelReason(event.target.value);
                                        setCancelFormError("");
                                    }}
                                    className="w-full border border-slate-300 p-2 text-sm rounded-md focus:outline-none focus:border-[#001f5f]"
                                    placeholder="Nhập lý do hủy..."
                                />
                            </div>
                        ) : null}

                        {cancelFormError ? <p className="mt-2 text-sm text-rose-600">{cancelFormError}</p> : null}

                        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={!!processingId}
                                onClick={() => setCancelTarget(null)}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-60 sm:w-auto"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                disabled={!!processingId}
                                onClick={async () => {
                                    const target = cancelTarget;
                                    if (!target?.id) return;
                                    const reason = selectedCancelReason === "Lý do khác"
                                        ? customCancelReason.trim()
                                        : selectedCancelReason;

                                    if (!reason) {
                                        setCancelFormError("Vui lòng nhập lý do hủy.");
                                        return;
                                    }

                                    setProcessingId(target.id);
                                    try {
                                        await appointmentService.remove(target.id, "DOCTOR", reason);
                                    } finally {
                                        setCancelTarget(null);
                                        setProcessingId(null);
                                    }
                                }}
                                className="w-full rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 disabled:opacity-60 sm:w-auto"
                            >
                                {processingId ? "Đang hủy..." : "Xác nhận hủy"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <ActionModal
                isOpen={!!doneTarget}
                title="Xác nhận khám xong"
                message="Lịch hẹn sẽ được đánh dấu đã khám và chuyển vào lịch sử của bệnh nhân."
                tone="info"
                confirmText={processingId ? "Đang xử lý..." : "Xác nhận"}
                cancelText="Đóng"
                showCancel
                loading={!!processingId}
                onClose={() => !processingId && setDoneTarget(null)}
                closeOnBackdrop={!processingId}
                onConfirm={async () => {
                    if (!doneTarget?.id) return;
                    setProcessingId(doneTarget.id);
                    try {
                        await appointmentService.markDone(doneTarget.id);
                        setDoneTarget(null);
                    } finally {
                        setProcessingId(null);
                    }
                }}
            />
        </section>
    );
}

export default Schedule;
