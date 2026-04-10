import { apiClient } from "../../axiosClient";

export async function getPendingAppointmentByDoctorId(id) {
    try {
        const { data } = await apiClient.get(`/appointments/pending/doctor/${id}`);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}