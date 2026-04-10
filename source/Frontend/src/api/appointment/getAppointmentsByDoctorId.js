import { apiClient } from "../axiosClient";

export async function getAppointmentsByDoctorId(id) {
    try {
        const { data: appointments } = await apiClient.get(`/appointments/doctor/${id}`);
        return appointments;
    }
    catch (error) {
        console.log(error.message);
    }
}