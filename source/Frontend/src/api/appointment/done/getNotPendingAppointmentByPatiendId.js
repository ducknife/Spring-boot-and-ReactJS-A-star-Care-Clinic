import { apiClient } from "../../axiosClient";

export async function getNotPendingAppointmentByPatientId(id) {
    try {
        const { data } = await apiClient.get(`/appointments/not-pending/patient/${id}`);
        return data;
    }
    catch (error) {
        console.error(error.message);
    }
}
