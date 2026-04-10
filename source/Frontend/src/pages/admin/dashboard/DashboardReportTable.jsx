import { useState, useEffect } from "react";
import { FaChartSimple } from "react-icons/fa6";
import { FaTableCells } from "react-icons/fa6";
import { appointmentService, serviceService } from "../../../api/services";

function DashboardReportTable() {
    const [data, setData] = useState([]);
    const [viewMode, setViewMode] = useState('chart'); // 'chart' hoặc 'table'
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState("--");
    const [year, setYear] = useState("--");

    useEffect(() => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        setMonth(currentMonth);
        setYear(currentYear);

        const fetchMonthData = async () => {
            try {
                const appointments = await appointmentService.doneThisMonth();
                
                // Tạo map để nhóm theo ngày
                const dailyStats = {};
                const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
                
                // Khởi tạo tất cả các ngày trong tháng
                for (let day = 1; day <= daysInMonth; day++) {
                    const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    dailyStats[dateKey] = {
                        day: day,
                        appointments: 0,
                        revenue: 0
                    };
                }

                // Tính toán số lượt khám và doanh thu theo ngày
                for (const apt of appointments) {
                    const aptDate = new Date(apt.startTime);
                    const dateKey = `${aptDate.getFullYear()}-${String(aptDate.getMonth() + 1).padStart(2, '0')}-${String(aptDate.getDate()).padStart(2, '0')}`;
                    
                    if (dailyStats[dateKey]) {
                        dailyStats[dateKey].appointments += 1;
                        
                        // Lấy giá dịch vụ
                        try {
                            const serviceId = parseInt(apt.note);
                            if (!isNaN(serviceId)) {
                                const service = await serviceService.getById(serviceId);
                                if (service && service.price) {
                                    dailyStats[dateKey].revenue += service.price;
                                }
                            }
                        } 
                        catch (err) {
                            console.error("Error fetching service:", err);
                        }
                    }
                }

                // Chuyển đổi thành mảng và sắp xếp theo ngày
                const statsArray = Object.values(dailyStats).sort((a, b) => a.day - b.day);
                setData(statsArray);
            } 
            catch (error) {
                console.error("Error fetching month data:", error);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchMonthData();
    }, []);

    // Custom tooltip cho biểu đồ
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-700 mb-2">Ngày {label}/{month}</p>
                    <p className="text-sky-600 text-sm">
                        Lượt khám: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                    <p className="text-emerald-600 text-sm">
                        Doanh thu: <span className="font-semibold">{payload[1].value.toLocaleString('vi-VN')} ₫</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-3xl border border-sky-50 shadow-md overflow-hidden">
            <div className="px-6 pt-4 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-[#00278D]">
                        Tổng quan tháng {month}/{year}
                    </h2>
                    <span className="text-xs text-slate-400">
                        * Dữ liệu tự động cập nhật định kỳ
                    </span>
                </div>
                
                {/* Chuyển đổi chế độ xem */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('chart')}
                        className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium transition-colors flex items-center gap-2 justify- ${
                            viewMode === 'chart'
                                ? 'bg-[#00278D] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <FaChartSimple/> Biểu đồ
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium flex items-center gap-2 transition-colors ${
                            viewMode === 'table'
                                ? 'bg-[#00278D] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <FaTableCells/> Bảng
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                </div>
            ) : viewMode === 'chart' ? (
                <div className="p-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="day" 
                                label={{ value: `Ngày trong tháng ${month}/${year}`, position: 'insideBottom', offset: -5 }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                yAxisId="left"
                                label={{ value: 'Lượt khám', angle: -90, position: 'insideLeft', offset: 10 }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right"
                                label={{ value: 'Doanh thu (₫)', angle: 90, position: 'insideRight', offset: -10 }}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.toLocaleString('vi-VN')}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                wrapperStyle={{ paddingTop: '20px' }}
                                iconType="line"
                            />
                            <Line 
                                yAxisId="left"
                                type="monotone" 
                                dataKey="appointments" 
                                stroke="#0ea5e9" 
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                name="Lượt khám"
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#cd0950" 
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                name="Doanh thu (₫)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-sky-50 z-10">
                            <tr className="text-[#00278D]">
                                <th className="px-6 py-3 text-left font-semibold">Ngày</th>
                                <th className="px-6 py-3 text-right font-semibold">
                                    Lượt khám
                                </th>
                                <th className="px-6 py-3 text-right font-semibold">
                                    Doanh thu (₫)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr
                                    key={i}
                                    className={
                                        i % 2 === 0
                                            ? "bg-white hover:bg-sky-50/60 transition"
                                            : "bg-slate-50 hover:bg-sky-50/60 transition"
                                    }
                                >
                                    <td className="px-6 py-3 text-slate-700">
                                        {row.day}/{month}/{year}
                                    </td>
                                    <td className="px-6 py-3 text-right text-slate-800">
                                        {row.appointments.toLocaleString("vi-VN")}
                                    </td>
                                    <td className="px-6 py-3 text-right text-emerald-600 font-semibold">
                                        {row.revenue.toLocaleString("vi-VN")} ₫
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DashboardReportTable;