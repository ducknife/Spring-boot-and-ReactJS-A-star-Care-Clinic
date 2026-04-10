import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/authUtils";
import { appointmentService, roomService, serviceService, userService } from "../../api/services";

function AppointmentCard({ appointment }) {

    var { id, patientId, doctorId, roomId, startTime, status, note, createdAt } = appointment;
    const [doctorInfo, setDoctorInfo] = useState({});
    const [patientInfo, setPatientInfo] = useState({});
    const [roomInfo, setRoomInfo] = useState({});
    const [serviceInfo, setServiceInfo] = useState({});
    const serviceId = Number.parseInt(note, 10);
    const role = getUserRole();

    const convertTimeFormat = (a) => {
        var res = "";
        var x;
        for (x in a) {
            if (a[x] != "T") res += a[x];
            else res += "\n";
        }
        return res;
    }
    startTime = convertTimeFormat(startTime);
    createdAt = convertTimeFormat(createdAt);

    const statusColors = {
        PENDING: "bg-sky-200 text-sky-700 border-sky-300",
        DONE: "bg-green-100 text-green-700 border-green-300",
        CANCELLED: "bg-red-100 text-red-700 border-red-300"
    };

    useEffect(() => {
        let mounted = true;

        const fetchRelated = async () => {
            try {
                const requests = [
                    roomService.getById(roomId),
                    role === "DOCTOR" ? userService.getById(patientId) : userService.getById(doctorId),
                    Number.isNaN(serviceId) ? Promise.resolve(null) : serviceService.getById(serviceId),
                ];

                const [roomData, personData, serviceData] = await Promise.all(requests);
                if (!mounted) return;

                setRoomInfo(roomData || {});
                if (role === "DOCTOR") {
                    setPatientInfo(personData || {});
                } else {
                    setDoctorInfo(personData || {});
                }
                setServiceInfo(serviceData || {});
            } catch (error) {
                console.error(error.message);
            }
        };

        if (roomId && (doctorId || patientId)) {
            fetchRelated();
        }

        return () => {
            mounted = false;
        };
    }, [doctorId, patientId, roomId, role, serviceId]);

    const navigate = useNavigate();

    const handleDeleteAppointment = async () => {
        if (confirm("Xác nhận xóa cuộc hẹn")) {
            try {
                await appointmentService.remove(id);
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }

    const handleChangeAppointmentStatusToDone = async () => {
        if (confirm("Xác nhận đánh dấu cuộc hẹn đã xong")) {
            try {
                await appointmentService.markDone(id);
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }

    const handleChangeAppointmentStatusToCancelled = async () => {
        if (confirm("Xác nhận hủy cuộc hẹn này")) {
            try {
                await appointmentService.markCancelled(id);
            }
            catch (error) {
                console.error(error.message);
            }
        }
    }

    return (
        <div className="bg-white h-[40vh] rounded-xl p-5 shadow-xl hover:shadow-md transition duration-200 flex flex-col justify-between">
            {/* Header */}
            <h3 className="text-lg font-semibold text-[#00278D] mb-3">
                Cuộc hẹn #{id}
            </h3>

            {/* Thông tin */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-gray-700 flex-grow">
                <div>
                    <p className="font-medium text-gray-500">{role == "DOCTOR" ? "Bệnh nhân:" : "Bác sĩ:"}</p>{" "}
                    <p className="font-semibold">{role == "DOCTOR" ? patientInfo.fullName : doctorInfo.fullName} </p>
                </div>
                <div>
                    <p className="font-medium text-gray-500">Phòng:</p>{" "}
                    <p className="font-semibold">{roomInfo.name}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-500">Thời gian:</p>{" "}
                    <p className="font-semibold">{startTime}</p>
                </div>
                {role == "PATIENT" ?
                    (<>
                        <div className="col-span-2">
                            <p className="font-medium text-gray-500">Ghi chú: {serviceInfo.name + "\n"}</p>
                            <p className="font-medium text-gray-500">Đơn giá: {serviceInfo.price + " vnđ"}</p>
                        </div>
                        <div className="text-sm text-gray-400">
                            <p className="font-medium text-gray-400">Tạo lúc:</p> {createdAt}
                        </div>
                    </>) : ""}
            </div>

            {/* Status */}
            <div className="mt-4 flex justify-between">
                <span
                    className={`px-3 py-2 rounded-md text-sm font-medium border ${statusColors[status]} 
                     w-2/3 text-center`}
                >
                    {status === "PENDING" ? "Đã xác nhận" :
                        status === "CANCELLED" ? "Bác sĩ đã hủy" : "Đã xong"}
                </span>
                {role == "PATIENT" ? status == "PENDING" ? <button onClick={() => appointment && navigate(`/patient/edit-appointment/${appointment.id}`)} className="cursor-pointer bg-sky-500 hover:bg-sky-600 text-white w-[100px] rounded text-sm flex justify-center items-center"><FaEdit /></button> :
                    <button onClick={handleDeleteAppointment} className="cursor-pointer hover:bg-red-800 delete-appointment bg-red-700 text-white w-[100px] rounded text-sm">{status == "PENDING" ? "Hủy" : "Xóa"}</button> : ""}
                {role == "DOCTOR" ? <button onClick={handleChangeAppointmentStatusToCancelled} className="cursor-pointer hover:bg-red-800 delete-appointment bg-red-700 text-white w-[100px] rounded text-sm">{status == "PENDING" ? "Hủy" : "Xóa"}</button> : ""}
            </div>
            {role == "PATIENT" ? <div className="edit-done mt-4 flex justify-between">
                {status == "PENDING" ? <button onClick={handleChangeAppointmentStatusToDone} className="py-2 px-3 cursor-pointer delete-appointment hover:bg-green-800 bg-green-700 text-white w-2/3 rounded text-sm">Đánh dấu là đã xong</button> : ""}
                {status == "PENDING" ? <button onClick={handleDeleteAppointment} className="cursor-pointer hover:bg-red-800 delete-appointment bg-red-700 text-white w-[100px] rounded text-sm">{status == "PENDING" ? "Hủy" : "Xóa"}</button> : ""}
            </div> : ""}
        </div>
    );
}

export default AppointmentCard;