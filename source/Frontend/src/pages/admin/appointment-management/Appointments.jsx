import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { appointmentService, roomService, userService } from "../../../api/services";

function AdminAppointmentManagement() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    // State cho filter
    const [filters, setFilters] = useState({
        doctorName: '',
        patientName: '',
        appointmentDate: '',
        status: '',
        roomName: ''
    });

    // Lấy danh sách doctors và rooms cho dropdown
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsData, roomsData] = await Promise.all([
                    userService.getDoctors(),
                    roomService.getAll()
                ]);
                setDoctors(doctorsData || []);
                setRooms(roomsData || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    // Lấy danh sách appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await appointmentService.getAll();
                setAppointments(response);
            }
            catch (err) {
                console.error("Error fetching users:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchAppointments();

    }, []);

    // Xử lý thay đổi filter
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý tìm kiếm
    const handleSearch = async () => {
        setLoading(true);
        try {
            const filteredData = await appointmentService.filter(filters);
            setAppointments(filteredData);
        } 
        catch (err) {
            console.error("Error filtering appointments:", err);
        } 
        finally {
            setLoading(false);
        }
    };

    // Reset filter
    const handleReset = async () => {
        setFilters({
            doctorName: '',
            patientName: '',
            appointmentDate: '',
            status: '',
            roomName: ''
        });
        setLoading(true);
        try {
            const response = await appointmentService.getAll();
            setAppointments(response);
        } 
        catch (err) {
            console.error("Error fetching appointments:", err);
        } 
        finally {
            setLoading(false);
        }
    };
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-tl from-sky-50 via-white to-sky-500 px-6 py-8"
        >
            <div className="max-w-9xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center justify-between"
                >
                    <h1 className="text-3xl font-bold text-[#00278D] mb-6 p-2 bg-white rounded-xl shadow-xl">Danh sách lịch hẹn</h1>
                </motion.div>

                {/* Thanh tìm kiếm / Filter */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-6"
                >
                    <h2 className="text-lg font-semibold text-[#00278D] mb-4">Tìm kiếm lịch hẹn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Tên bác sĩ */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên bác sĩ
                            </label>
                            <input
                                type="text"
                                name="doctorName"
                                value={filters.doctorName}
                                onChange={handleFilterChange}
                                placeholder="Nhập tên bác sĩ..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>

                        {/* Tên bệnh nhân */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên bệnh nhân
                            </label>
                            <input
                                type="text"
                                name="patientName"
                                value={filters.patientName}
                                onChange={handleFilterChange}
                                placeholder="Nhập tên bệnh nhân..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>

                        {/* Ngày khám */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày khám
                            </label>
                            <input
                                type="date"
                                name="appointmentDate"
                                value={filters.appointmentDate}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="PENDING">Chờ xác nhận</option>
                                <option value="DONE">Hoàn thành</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </select>
                        </div>

                        {/* Tên phòng */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên phòng
                            </label>
                            <input
                                type="text"
                                name="roomName"
                                value={filters.roomName}
                                onChange={handleFilterChange}
                                placeholder="Nhập tên phòng..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleSearch}
                                className="flex-1 bg-[#00278D] text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium"
                            >
                                Tìm kiếm
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            >
                                Đặt lại
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                >
                    <table className="min-w-full text-sm">
                        <thead className="bg-sky-50 text-[#00278D]">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold">STT</th>
                                <th className="px-6 py-3 text-left font-semibold">Tên bác sĩ</th>
                                <th className="px-6 py-3 text-left font-semibold">Tên bệnh nhân</th>
                                <th className="px-6 py-3 text-center font-semibold">Phòng</th>
                                <th className="px-6 py-3 text-center font-semibold">Dịch vụ</th>
                                <th className="px-6 py-3 text-center font-semibold">Thời gian</th>
                                <th className="px-6 py-3 text-center font-semibold">Ngày tạo</th>
                                <th className="px-6 py-3 text-center font-semibold">Trạng thái</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                                        Đang tải danh sách lịch hẹn...
                                    </td>
                                </tr>
                            ) : appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-6 text-center text-slate-500">
                                        Không có lịch hẹn nào.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((a, idx) => (
                                    <AppointmentLine a={a} key={idx} idx={idx} />
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default AdminAppointmentManagement;