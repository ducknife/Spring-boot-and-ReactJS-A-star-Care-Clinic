import { useEffect, useState } from "react";
import { getUserId } from "../../utils/authUtils";
import { appointmentService, serviceService, userService } from "../../api";
import { APPOINTMENT_CHANGED_EVENT } from "../../api/services/appointmentService";

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

const statusLabel = (status) => (status === "DONE" ? "Đã khám" : "Chưa khám");
const paymentMethodLabel = "Thanh toán tại quầy";

function HistoryPage() {
    const id = getUserId();
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [appointments, setAppointments] = useState([]);
    const [patientInfo, setPatientInfo] = useState(null);
    const [doctorMap, setDoctorMap] = useState({});
    const [serviceMap, setServiceMap] = useState({});
    const [detailTarget, setDetailTarget] = useState(null);

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
            return;
        }

        const getPatientInfo = async () => {
            try {
                const patient = await userService.getById(id);
                setPatientInfo(patient || null);
            } catch {
                setPatientInfo(null);
            }
        };

        getPatientInfo();
    }, [id]);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const getDoneAppointments = async () => {
            setLoading(true);
            try {
                const pageResponse = await appointmentService.historyByPatientId(id, {
                    page: currentPage,
                    size: 5,
                    sort: "startTime,desc",
                });

                const normalized = pageResponse?.content || [];
                setAppointments(normalized);
                setTotalPages(pageResponse?.totalPages || 0);

                const doctorIds = [...new Set(normalized.map((item) => item.doctorId).filter(Boolean))];
                const serviceIds = [...new Set(normalized.map((item) => Number(item.serviceId ?? item.note)).filter((value) => !Number.isNaN(value)))];

                const [doctorResponses, serviceResponses] = await Promise.all([
                    Promise.all(
                        doctorIds.map(async (doctorId) => {
                            const [doctorResult, profileResult] = await Promise.allSettled([
                                userService.getById(doctorId),
                                userService.getDoctorProfile(doctorId),
                            ]);

                            const doctor = doctorResult.status === "fulfilled" ? doctorResult.value : null;
                            const profile = profileResult.status === "fulfilled" ? profileResult.value : null;

                            if (!doctor?.id) {
                                return null;
                            }

                            return {
                                ...doctor,
                                clinicLocation: profile?.clinicLocation || doctor?.clinicLocation || "",
                                workingDays: profile?.workingDays || doctor?.workingDays || "",
                                specialty: profile?.specialty || doctor?.specialty || "",
                            };
                        })
                    ),
                    Promise.all(serviceIds.map((serviceId) => serviceService.getById(serviceId))),
                ]);

                setDoctorMap(
                    doctorResponses.reduce((acc, doctor) => {
                        if (doctor?.id) acc[doctor.id] = doctor;
                        return acc;
                    }, {})
                );

                setServiceMap(
                    serviceResponses.reduce((acc, service) => {
                        if (service?.id) acc[service.id] = service;
                        return acc;
                    }, {})
                );
            }
            catch (err) {
                console.log(err.message);
                setAppointments([]);
                setTotalPages(0);
            }
            finally {
                setLoading(false);
            }
        };
        getDoneAppointments();

    }, [id, refreshKey, currentPage]);

    if (loading) return <p className="text-center text-gray-500 py-10">Đang tải...</p>;

    return (
        <div className="bg-[var(--surface)] min-h-[40vh]">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="bg-white w-fit h-fit p-3 rounded-2xl shadow-lg">
                        <h1 className="text-2xl font-bold text-[#00278D] sm:text-4xl">Lịch sử khám</h1>
                    </div>
                </div>

                {appointments.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {appointments.map((appointment) => {
                            const doctor = doctorMap[appointment.doctorId] || {};
                            const serviceId = Number(appointment.serviceId ?? appointment.note);
                            const service = serviceMap[serviceId] || {};

                            return (
                                <div key={appointment.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                        <div className="md:col-span-4">
                                            <p className="text-xs uppercase tracking-wide text-slate-500">Bác sĩ</p>
                                            <p className="text-base font-semibold text-slate-800">{doctor.fullName || "Đang cập nhật"}</p>
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
                                            <span className="inline-flex px-3 py-1 rounded-full text-sm border font-semibold bg-green-100 text-green-700 border-green-300">
                                                Đã khám
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 text-sm text-slate-600">
                                        <span className="font-semibold">Phòng khám:</span> {doctor.clinicLocation || "Đang cập nhật"}
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                        <div className="text-sm text-slate-600">
                                            <span className="font-semibold">Phương thức thanh toán:</span> {paymentMethodLabel}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setDetailTarget({ appointment, doctor, service })}
                                            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 sm:w-auto"
                                        >
                                            Chi tiết
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
                    <p className="text-xl text-[#00278D]">
                        {"Chưa có lịch hẹn nào hoàn thành."}
                    </p>
                )}

                {detailTarget ? (
                    <div className="fixed inset-0 z-[10000] bg-black/40 p-4 flex items-center justify-center" onClick={() => setDetailTarget(null)}>
                        <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 sm:p-6" onClick={(event) => event.stopPropagation()}>
                            <h3 className="text-2xl font-bold text-[#00278D]">Chi tiết lịch sử khám</h3>
                            <p className="text-sm text-slate-500 mt-1">Mã lịch hẹn: #{detailTarget.appointment.id}</p>

                            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Tên bệnh nhân</p>
                                    <p className="font-semibold text-slate-800">{patientInfo?.fullName || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Số điện thoại bệnh nhân</p>
                                    <p className="font-semibold text-slate-800">{patientInfo?.phone || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Bác sĩ</p>
                                    <p className="font-semibold text-slate-800">{detailTarget.doctor.fullName || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Số điện thoại bác sĩ</p>
                                    <p className="font-semibold text-slate-800">{detailTarget.doctor.phone || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Dịch vụ</p>
                                    <p className="font-semibold text-slate-800">{detailTarget.service.name || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Thời gian khám</p>
                                    <p className="font-semibold text-slate-800">{formatDateTime(detailTarget.appointment.startTime)}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Trạng thái</p>
                                    <p className="font-semibold text-slate-800">{statusLabel(detailTarget.appointment.status)}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Phương thức thanh toán</p>
                                    <p className="font-semibold text-slate-800">{paymentMethodLabel}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-slate-500 mb-1">Phòng khám</p>
                                    <p className="font-semibold text-slate-800">{detailTarget.doctor?.clinicLocation || "Đang cập nhật"}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
                                    <p className="text-slate-500 mb-1">Ghi chú</p>
                                    <p className="font-medium text-slate-700">{detailTarget.appointment.reason || detailTarget.appointment.note || "Không có"}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <span className="inline-flex items-center rounded-md bg-green-100 border border-green-300 text-green-700 font-semibold text-sm px-3 py-1.5">
                                    Đã thanh toán
                                </span>
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
        </div>
    );
}

export default HistoryPage;
