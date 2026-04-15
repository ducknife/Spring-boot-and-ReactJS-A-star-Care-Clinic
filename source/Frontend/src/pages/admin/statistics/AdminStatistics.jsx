import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaChartSimple, FaTableCells } from "react-icons/fa6";
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from "recharts";
import { appointmentService, serviceService, userService } from "../../../api";
import CustomDropdown from "../../../components/CustomDropdown";

const PAGE_SIZE = 10;
const ALL_SERVICES_VALUE = "ALL_SERVICES";
const ALL_DOCTORS_VALUE = "ALL_DOCTORS";

const toInputDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const parseInputDate = (value) => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) {
        return null;
    }
    return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const dateKeyOf = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatDateLabel = (key) => {
    const [year, month, day] = key.split("-");
    return `${day}/${month}/${year}`;
};

const normalizeServiceId = (appointment) => {
    const rawServiceId = appointment?.serviceId ?? appointment?.note;
    const serviceId = Number.parseInt(rawServiceId, 10);
    return Number.isNaN(serviceId) ? null : serviceId;
};

const buildMonthRange = (year, month) => {
    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);
    return {
        from: toInputDate(firstDate),
        to: toInputDate(lastDate),
    };
};

const buildQuarterRange = (year, quarter) => {
    const firstMonth = (quarter - 1) * 3 + 1;
    const firstDate = new Date(year, firstMonth - 1, 1);
    const lastDate = new Date(year, firstMonth + 2, 0);
    return {
        from: toInputDate(firstDate),
        to: toInputDate(lastDate),
    };
};

function AdminStatistics() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentQuarter = Math.floor((currentMonth - 1) / 3) + 1;

    const [fromDate, setFromDate] = useState(buildMonthRange(currentYear, currentMonth).from);
    const [toDate, setToDate] = useState(toInputDate(now));

    const [monthPreset, setMonthPreset] = useState(currentMonth);
    const [monthPresetYear, setMonthPresetYear] = useState(currentYear);

    const [quarterPreset, setQuarterPreset] = useState(currentQuarter);
    const [quarterPresetYear, setQuarterPresetYear] = useState(currentYear);

    const [groupMode, setGroupMode] = useState("service");
    const [selectedServiceId, setSelectedServiceId] = useState(ALL_SERVICES_VALUE);
    const [selectedDoctorId, setSelectedDoctorId] = useState(ALL_DOCTORS_VALUE);

    const [viewMode, setViewMode] = useState("chart");
    const [currentPage, setCurrentPage] = useState(1);

    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const presetYears = useMemo(() => {
        return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
    }, [currentYear]);

    const monthOptions = useMemo(
        () => Array.from({ length: 12 }, (_, index) => {
            const value = String(index + 1);
            return { value, label: `Tháng ${value}` };
        }),
        []
    );

    const yearOptions = useMemo(
        () => presetYears.map((yearValue) => ({ value: String(yearValue), label: String(yearValue) })),
        [presetYears]
    );

    const quarterOptions = useMemo(
        () => [1, 2, 3, 4].map((quarter) => ({ value: String(quarter), label: `Quý ${quarter}` })),
        []
    );

    const serviceOptions = useMemo(
        () => [
            { value: ALL_SERVICES_VALUE, label: "Tất cả dịch vụ" },
            ...services.map((service) => ({ value: String(service.id), label: service.name })),
        ],
        [services]
    );

    const doctorOptions = useMemo(
        () => [
            { value: ALL_DOCTORS_VALUE, label: "Tất cả bác sĩ" },
            ...doctors.map((doctor) => ({ value: String(doctor.id), label: doctor.fullName })),
        ],
        [doctors]
    );

    const loadData = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError("");

        try {
            const [appointmentData, serviceData, doctorData] = await Promise.all([
                appointmentService.filter({ status: "DONE" }),
                serviceService.getAll(),
                userService.getDoctors({ page: 0, size: 200, sort: "fullName,asc" }),
            ]);

            const resolvedAppointments = Array.isArray(appointmentData) ? appointmentData : [];
            const resolvedServices = Array.isArray(serviceData) ? serviceData : [];
            const resolvedDoctors = Array.isArray(doctorData)
                ? doctorData
                : Array.isArray(doctorData?.content)
                    ? doctorData.content
                    : [];

            setAppointments(resolvedAppointments);
            setServices(resolvedServices);
            setDoctors(resolvedDoctors);
        } catch (err) {
            setError(err.message || "Khong the tai du lieu thong ke");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData(false);
    }, []);

    useEffect(() => {
        if (!selectedServiceId && services.length > 0) {
            setSelectedServiceId(String(services[0].id));
        }
    }, [services, selectedServiceId]);

    useEffect(() => {
        if (!selectedDoctorId && doctors.length > 0) {
            setSelectedDoctorId(String(doctors[0].id));
        }
    }, [doctors, selectedDoctorId]);

    const chartData = useMemo(() => {
        const startDate = parseInputDate(fromDate);
        const endDate = parseInputDate(toDate);

        if (!startDate || !endDate || startDate > endDate) {
            return [];
        }

        const rowsByDate = new Map();
        const cursor = new Date(startDate);
        while (cursor <= endDate) {
            const key = dateKeyOf(cursor);
            rowsByDate.set(key, {
                dateKey: key,
                dateLabel: formatDateLabel(key),
                appointments: 0,
                revenue: 0,
            });
            cursor.setDate(cursor.getDate() + 1);
        }

        const selectedServiceNumericId = Number.parseInt(selectedServiceId, 10);
        const selectedDoctorNumericId = Number.parseInt(selectedDoctorId, 10);
        const servicePriceMap = new Map(
            services.map((service) => [Number(service.id), Number(service.price) || 0])
        );

        appointments.forEach((appointment) => {
            if (String(appointment?.status || "").toUpperCase() !== "DONE") {
                return;
            }

            const appointmentDate = new Date(appointment.startTime);
            if (Number.isNaN(appointmentDate.getTime())) {
                return;
            }

            const key = dateKeyOf(appointmentDate);
            if (!rowsByDate.has(key)) {
                return;
            }

            const serviceId = normalizeServiceId(appointment);
            if (groupMode === "service" && Number.isFinite(selectedServiceNumericId) && serviceId !== selectedServiceNumericId) {
                return;
            }

            const doctorId = Number(appointment.doctorId);
            if (groupMode === "doctor" && Number.isFinite(selectedDoctorNumericId) && doctorId !== selectedDoctorNumericId) {
                return;
            }

            const row = rowsByDate.get(key);
            row.appointments += 1;
            row.revenue += serviceId !== null ? servicePriceMap.get(serviceId) || 0 : 0;
        });

        return Array.from(rowsByDate.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    }, [appointments, fromDate, toDate, groupMode, selectedDoctorId, selectedServiceId, services]);

    const totalVisits = useMemo(() => chartData.reduce((sum, row) => sum + row.appointments, 0), [chartData]);
    const totalRevenue = useMemo(() => chartData.reduce((sum, row) => sum + row.revenue, 0), [chartData]);

    const totalPages = useMemo(() => {
        const pages = Math.ceil(chartData.length / PAGE_SIZE);
        return pages > 0 ? pages : 1;
    }, [chartData]);

    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return chartData.slice(start, start + PAGE_SIZE);
    }, [chartData, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [fromDate, toDate, groupMode, selectedDoctorId, selectedServiceId]);

    const invalidRange = useMemo(() => {
        const startDate = parseInputDate(fromDate);
        const endDate = parseInputDate(toDate);
        return !!startDate && !!endDate && startDate > endDate;
    }, [fromDate, toDate]);

    const selectedService = services.find((service) => String(service.id) === String(selectedServiceId));
    const selectedDoctor = doctors.find((doctor) => String(doctor.id) === String(selectedDoctorId));

    const scopeLabel = groupMode === "service"
        ? selectedService?.name || "Tat ca dich vu"
        : selectedDoctor?.fullName || "Tat ca bac si";

    const applyMonthPreset = () => {
        const range = buildMonthRange(Number(monthPresetYear), Number(monthPreset));
        setFromDate(range.from);
        setToDate(range.to);
    };

    const applyQuarterPreset = () => {
        const range = buildQuarterRange(Number(quarterPresetYear), Number(quarterPreset));
        setFromDate(range.from);
        setToDate(range.to);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-sky-600 mt-1">
                        Luot kham: <span className="font-semibold">{payload[0]?.value || 0}</span>
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                        Doanh thu: <span className="font-semibold">{Number(payload[1]?.value || 0).toLocaleString("vi-VN")} d</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="min-h-screen bg-[var(--surface)] px-4 py-8 text-slate-800 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-7xl space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-3xl border border-slate-100 bg-white px-4 py-4 shadow-xl sm:px-6 sm:py-5"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#00278D] sm:text-3xl">Thống kê quản trị</h1>
                            <p className="text-slate-600 mt-2">
                                Theo dõi lượt khám và doanh thu theo ngày, hỗ trợ lọc theo dịch vụ hoặc bác sĩ.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => loadData(true)}
                            disabled={refreshing}
                            className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand-700)] disabled:opacity-60 sm:w-fit"
                        >
                            {refreshing ? "Dang lam moi..." : "Lam moi du lieu"}
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl sm:p-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-[#00278D]">Khoang ngay tuy chinh</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex flex-col gap-1 text-sm text-slate-600">
                                    From
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(event) => setFromDate(event.target.value)}
                                        className="rounded-lg border border-slate-300 px-3 py-2"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm text-slate-600">
                                    To
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(event) => setToDate(event.target.value)}
                                        className="rounded-lg border border-slate-300 px-3 py-2"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-[#00278D]">Thong ke theo thang</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <CustomDropdown
                                    value={monthPreset}
                                    onValueChange={setMonthPreset}
                                    options={monthOptions}
                                    buttonClassName="py-2.5 text-sm"
                                />
                                <CustomDropdown
                                    value={monthPresetYear}
                                    onValueChange={setMonthPresetYear}
                                    options={yearOptions}
                                    buttonClassName="py-2.5 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={applyMonthPreset}
                                    className="rounded-lg border border-[var(--brand-600)] px-3 py-2 text-sm font-semibold text-[var(--brand-600)] hover:bg-sky-50"
                                >
                                    Ap dung thang
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-[#00278D]">Thong ke theo quy</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <CustomDropdown
                                    value={quarterPreset}
                                    onValueChange={setQuarterPreset}
                                    options={quarterOptions}
                                    buttonClassName="py-2.5 text-sm"
                                />
                                <CustomDropdown
                                    value={quarterPresetYear}
                                    onValueChange={setQuarterPresetYear}
                                    options={yearOptions}
                                    buttonClassName="py-2.5 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={applyQuarterPreset}
                                    className="rounded-lg border border-[var(--brand-600)] px-3 py-2 text-sm font-semibold text-[var(--brand-600)] hover:bg-sky-50"
                                >
                                    Ap dung quy
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-[#00278D]">Kieu thong ke</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="group-mode"
                                        value="service"
                                        checked={groupMode === "service"}
                                        onChange={() => setGroupMode("service")}
                                    />
                                    Theo dich vu
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="group-mode"
                                        value="doctor"
                                        checked={groupMode === "doctor"}
                                        onChange={() => setGroupMode("doctor")}
                                    />
                                    Theo bac si
                                </label>
                            </div>

                            {groupMode === "service" ? (
                                <CustomDropdown
                                    value={selectedServiceId}
                                    onValueChange={setSelectedServiceId}
                                    options={serviceOptions}
                                    buttonClassName="py-2.5 text-sm"
                                />
                            ) : (
                                <CustomDropdown
                                    value={selectedDoctorId}
                                    onValueChange={setSelectedDoctorId}
                                    options={doctorOptions}
                                    buttonClassName="py-2.5 text-sm"
                                />
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="rounded-3xl bg-white shadow-xl border border-slate-100 overflow-hidden"
                >
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 md:flex-row md:items-center md:justify-between sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[#00278D]">Du lieu theo ngay</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Pham vi: <span className="font-semibold text-slate-700">{scopeLabel}</span>
                            </p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                                <span className="rounded-full bg-sky-50 border border-sky-100 px-3 py-1">
                                    Tong luot kham: {totalVisits.toLocaleString("vi-VN")}
                                </span>
                                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1">
                                    Tong doanh thu: {totalRevenue.toLocaleString("vi-VN")} d
                                </span>
                            </div>
                        </div>

                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                            <button
                                type="button"
                                onClick={() => setViewMode("chart")}
                                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                                    viewMode === "chart"
                                        ? "bg-[#00278D] text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                <FaChartSimple /> Bieu do duong
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("table")}
                                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                                    viewMode === "table"
                                        ? "bg-[#00278D] text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                <FaTableCells /> Bang du lieu
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="px-6 py-10 text-center text-slate-500">Dang tai du lieu thong ke...</div>
                    ) : error ? (
                        <div className="px-6 py-10 text-center text-rose-600">{error}</div>
                    ) : invalidRange ? (
                        <div className="px-6 py-10 text-center text-amber-600">Ngay from phai nho hon hoac bang ngay to.</div>
                    ) : viewMode === "chart" ? (
                        <div className="px-4 py-6">
                            <ResponsiveContainer width="100%" height={420}>
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} />
                                    <YAxis
                                        yAxisId="left"
                                        tick={{ fontSize: 11 }}
                                        allowDecimals={false}
                                        label={{ value: "Luot kham", angle: -90, position: "insideLeft" }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={(value) => Number(value).toLocaleString("vi-VN")}
                                        label={{ value: "Doanh thu (d)", angle: 90, position: "insideRight" }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: 12 }} />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="appointments"
                                        stroke="#0ea5e9"
                                        strokeWidth={2}
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 4 }}
                                        name="Luot kham"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ r: 2 }}
                                        activeDot={{ r: 4 }}
                                        name="Doanh thu (d)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-sky-50 text-[#00278D]">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold">Ngay</th>
                                            <th className="px-4 py-3 text-right font-semibold">Luot kham</th>
                                            <th className="px-4 py-3 text-right font-semibold">Doanh thu (d)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRows.map((row, index) => (
                                            <tr
                                                key={row.dateKey}
                                                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                                            >
                                                <td className="px-4 py-3 text-slate-700">{row.dateLabel}</td>
                                                <td className="px-4 py-3 text-right text-slate-800">{row.appointments.toLocaleString("vi-VN")}</td>
                                                <td className="px-4 py-3 text-right text-emerald-600 font-semibold">{row.revenue.toLocaleString("vi-VN")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 sm:w-auto"
                                >
                                    Trang truoc
                                </button>
                                <span className="text-sm text-slate-600">
                                    Trang {currentPage}/{totalPages} (10 ngay/trang)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 sm:w-auto"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

export default AdminStatistics;
